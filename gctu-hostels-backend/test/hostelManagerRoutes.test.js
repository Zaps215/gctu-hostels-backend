const assert = require('node:assert/strict');
const express = require('express');
const { after, before, test } = require('node:test');

const Hostel = require('../models/Hostel');
const User = require('../models/User');
const hostelRoutes = require('../routes/hostelRoutes');

const originalMethods = {
    create: Hostel.create,
    find: Hostel.find,
    countDocuments: Hostel.countDocuments,
    findOne: Hostel.findOne,
    findOneAndDelete: Hostel.findOneAndDelete,
    findUserById: User.findById
};

let server;
let baseUrl;
let ownedListing;
const userRoles = new Map([
    ['student-1', 'student'],
    ['manager-1', 'manager'],
    ['manager-2', 'manager']
]);

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.session = {
        userId: req.get('x-test-user') || 'student-1',
        userRole: req.get('x-test-role') || 'student',
        authVersion: 0
    };
    next();
});
app.use('/api/hostels', hostelRoutes);

function request(path, { method = 'GET', role = 'student', user = 'student-1', body } = {}) {
    return fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-test-role': role,
            'x-test-user': user
        },
        body: body === undefined ? undefined : JSON.stringify(body)
    });
}

before(async () => {
    ownedListing = {
        _id: 'listing-1',
        owner: 'manager-1',
        name: 'Existing Hostel',
        async save() {
            return this;
        }
    };

    Hostel.create = async values => ({ _id: 'new-listing', ...values });
    Hostel.find = query => ({
        sort() {
            return this;
        },
        skip() {
            return this;
        },
        limit() {
            return this;
        },
        async exec() {
            return query.owner === 'manager-1' ? [ownedListing] : [];
        }
    });
    Hostel.countDocuments = async () => 0;
    Hostel.findOne = async query => {
        if (query._id === ownedListing._id && String(query.owner) === ownedListing.owner) {
            return ownedListing;
        }
        return null;
    };
    Hostel.findOneAndDelete = async query => {
        if (query._id === ownedListing._id && String(query.owner) === ownedListing.owner) {
            return ownedListing;
        }
        return null;
    };
    User.findById = userId => {
        const role = userRoles.get(String(userId));
        const user = role ? { role, sessionVersion: 0 } : null;
        return {
            select: async () => user,
            then: (resolve, reject) => Promise.resolve(user).then(resolve, reject)
        };
    };

    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    Hostel.create = originalMethods.create;
    Hostel.find = originalMethods.find;
    Hostel.countDocuments = originalMethods.countDocuments;
    Hostel.findOne = originalMethods.findOne;
    Hostel.findOneAndDelete = originalMethods.findOneAndDelete;
    User.findById = originalMethods.findUserById;
});

test('public hostel search treats regex input literally and caps page size', async () => {
    let capturedQuery;
    let capturedSkip;
    let capturedLimit;
    const originalFind = Hostel.find;
    const originalCountDocuments = Hostel.countDocuments;
    Hostel.find = query => {
        capturedQuery = query;
        return {
            sort() { return this; },
            skip(value) { capturedSkip = value; return this; },
            limit(value) { capturedLimit = value; return this; },
            async exec() { return []; }
        };
    };
    Hostel.countDocuments = async () => 0;

    try {
        const response = await request('/api/hostels?search=.*&page=3&limit=500');
        const result = await response.json();

        assert.equal(response.status, 200);
        assert.equal(capturedQuery.$or[0].name.$regex, '\\.\\*');
        assert.equal(capturedSkip, 100);
        assert.equal(capturedLimit, 50);
        assert.equal(result.pagination.page, 3);
        assert.equal(result.pagination.limit, 50);
    } finally {
        Hostel.find = originalFind;
        Hostel.countDocuments = originalCountDocuments;
    }
});

test('public hostel search rejects non-string and oversized values', async () => {
    const oversizedResponse = await request(`/api/hostels?search=${'a'.repeat(101)}`);
    assert.equal(oversizedResponse.status, 400);

    const arrayResponse = await request('/api/hostels?search=hostel&search=other');
    assert.equal(arrayResponse.status, 400);
});

test('public hostel search rejects invalid pagination values', async () => {
    const response = await request('/api/hostels?page=0&limit=-1');
    assert.equal(response.status, 400);
});

test('students cannot create manager listings', async () => {
    const response = await request('/api/hostels', {
        method: 'POST',
        body: { name: 'Attempted listing', owner: 'student-1' }
    });

    assert.equal(response.status, 403);
});

test('manager-created listings are assigned to the signed-in manager', async () => {
    const response = await request('/api/hostels', {
        method: 'POST',
        role: 'manager',
        user: 'manager-1',
        body: { name: 'New Hostel', owner: 'manager-2' }
    });
    const result = await response.json();

    assert.equal(response.status, 201);
    assert.equal(result.data.owner, 'manager-1');
});

test('only managers can load their owner-scoped dashboard listings', async () => {
    const deniedResponse = await request('/api/hostels/mine');
    assert.equal(deniedResponse.status, 403);

    const allowedResponse = await request('/api/hostels/mine', {
        role: 'manager',
        user: 'manager-1'
    });
    const result = await allowedResponse.json();
    assert.equal(allowedResponse.status, 200);
    assert.equal(result.count, 1);
    assert.equal(result.data[0].owner, 'manager-1');
});

test('manager access is revoked when the account is demoted or deleted', async () => {
    try {
        userRoles.set('manager-1', 'student');
        const demotedResponse = await request('/api/hostels/mine', {
            role: 'manager',
            user: 'manager-1'
        });
        assert.equal(demotedResponse.status, 403);

        userRoles.delete('manager-1');
        const deletedResponse = await request('/api/hostels/mine', {
            role: 'manager',
            user: 'manager-1'
        });
        assert.equal(deletedResponse.status, 401);
    } finally {
        userRoles.set('manager-1', 'manager');
    }
});

test('only the owning manager can update or delete a listing', async () => {
    const deniedUpdate = await request('/api/hostels/listing-1', {
        method: 'PUT',
        role: 'manager',
        user: 'manager-2',
        body: { name: 'Tampered name', owner: 'manager-2' }
    });
    assert.equal(deniedUpdate.status, 404);
    assert.equal(ownedListing.name, 'Existing Hostel');

    const allowedUpdate = await request('/api/hostels/listing-1', {
        method: 'PUT',
        role: 'manager',
        user: 'manager-1',
        body: { name: 'Updated Hostel', owner: 'manager-2' }
    });
    const updateResult = await allowedUpdate.json();
    assert.equal(allowedUpdate.status, 200);
    assert.equal(updateResult.data.name, 'Updated Hostel');
    assert.equal(updateResult.data.owner, 'manager-1');

    const deniedDelete = await request('/api/hostels/listing-1', {
        method: 'DELETE',
        role: 'manager',
        user: 'manager-2'
    });
    assert.equal(deniedDelete.status, 404);

    const allowedDelete = await request('/api/hostels/listing-1', {
        method: 'DELETE',
        role: 'manager',
        user: 'manager-1'
    });
    assert.equal(allowedDelete.status, 200);
});
