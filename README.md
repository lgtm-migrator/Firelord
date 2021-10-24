<!-- markdownlint-disable MD010 -->

# firelord(BETA, Nodejs ONLY)

[![npm](https://img.shields.io/npm/v/firelord)](https://www.npmjs.com/package/firelord) [![GitHub](https://img.shields.io/github/license/tylim88/firelord)](https://github.com/tylim88/firelord/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelord/pulls)

🐤 admin firestore wrapper with deeper typing solution.

🚀 All read and write operation are typed, field path, field value, collection path, document path, everything is typed!

🔥 Automatically convert base type to corresponding read and write time(good at handling timestamp and field value).

✨ Api closely resemble firestore api, low learning curve.

🐉 Zero dependency.

⛲️ Out of box typescript support.

Variants:

1. [react native](https://www.npmjs.com/package/firelordrn)
2. [js](https://www.npmjs.com/package/firelordjs)

## 🦙 Purpose

Unfortunately `withConverter` is not enough to solve the type problems, there is still no feasible solutions to deal with type like date, firestore.Timestamp, number and array where different types in read, write and compare(query) are needed. This library is a wrapper that introduce deeper typing solution to handle each case.

Not only this library deal with data type, it also provide type safe for collection path, document path, firestore limitations(whenever is possible).

require typescript 4.1 and above

Overview:

- generate read(get operation), write type(set/update operation) and compare type(for query) for field value, example:
  - server timestamp: `{write: Firestore.FieldValue, read: Firestore.Timestamp, compare: Date | Firestore.Timestamp}`
  - number: `{write: FieldValue | number, read: number, compare:number}`
  - xArray: `{write: x[] | FieldValue, read: x[], compare: x[]}`
  - see [conversion table](#-conversion-table) for more
- Typed collection path and document path.
  - auto generate sub collection path type.
- auto generate `updatedAt` and`createdAt` timestamp.
  - auto update `updatedAt` server timestamp to **update** operation.
  - auto add `createdAt` and `updatedAt` server timestamp to **create** and **set** operation.
- much better where and orderBy clause
  - field value are typed accordingly to field path
  - comparator depend on field value type, eg you cannot apply `array-contains` operator onto non-array field value
  - whether you can chain orderBy clause or not is depends on comparator's value, this is according to [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations), see image below. Go to [Order And Limit](#-collection-operations-order-and-limit) for documentation.

![orderBy limitation](img/orderBy.png)

basically all read operation return `read type` data, all write operation require `write type` data and all query require `compare type` data, you only need to define `base type` and the wrapper will generates the other 3 types for you.

You don't need to do any kind of manipulation onto `read`, `write` and `compare` types nor you need to utilize them.

the documentation explains how the types work, the library itself is intuitive in practice, thoroughly refer to the documentation only if you want to have better understanding on how the typing work.

You SHOULD NOT try to memorize how the typing work, keep in mind the purpose is not for you to fit into the type but is to let the type GUIDE you.

## 🦜 Getting Started

```bash
npm i firelord
```

```ts
import { firelord, Firelord } from 'firelord'

// create wrapper
const wrapper = firelord(firestore)

// use base type to generate read and write type
type User = Firelord.ReadWriteCreator<
	{
		name: string
		age: number
		birthday: Date
		joinDate: 'ServerTimestamp'
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection path type
	string // document path type
>

// read type
type UserRead = User['read'] // {name: string, age:number, birthday:firestore.Timestamp, joinDate: firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt:'ServerTimestamp', updatedAt:'ServerTimestamp'}

// compare type
type UserCompare = User['compare'] // {name: string, age:number, birthday:Date | firestore.Timestamp, joinDate: Date | firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// implement wrapper
const userCreator = wrapper<User>()
// collection reference
const users = userCreator.col('Users') // collection path type is "Users"
// collection group reference
const userGroup = userCreator.colGroup('Users') // collection path type is "Users"
// user reference
const user = users.doc('1234567890') // document path is string

// subCollection of User
type Transaction = Firelord.ReadWriteCreator<
	{
		amount: number
		date: 'ServerTimestamp'
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection path type
	string, // document path type
	User // insert parent collection, it will auto construct the sub collection path for you
>

// implement the wrapper
const transactions = wrapper<Transaction>().col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transaction = users.doc('1234567890') // document path is string
```

## 🦔 Conversion Table

| Base                        | Read                  | Write                                                                                                                                               | Compare                                      |
| --------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| number                      | number                | number \| FirebaseFirestore.FieldValue (firestore.FieldValue.increment\*)                                                                           | number                                       |
| string                      | string                | string                                                                                                                                              | string                                       |
| null                        | null                  | null                                                                                                                                                | null                                         |
| undefined                   | undefined             | undefined                                                                                                                                           | undefined                                    |
| Date\*\*\*                  | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                                                          | firestore.Timestamp \|Date                   |
| firestore.Timestamp\*\*\*   | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                                                          | firestore.Timestamp \|Date                   |
| 'ServerTimestamp'           | firestore.Timestamp   | FirebaseFirestore.FieldValue (firestore.FieldValue.serverTimestamp*) \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion*)   | firestore.Timestamp \|Date                   |
| firestore.GeoPoint          | firestore.GeoPoint    | firestore.GeoPoint                                                                                                                                  | firestore.GeoPoint                           |
| object                      | object[]\*\*          | object[]\*\*                                                                                                                                        | object[]\*\*                                 |
| number[]                    | number[]              | number[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                              | number[]                                     |
| string[]                    | string[]              | string[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                              | string[]                                     |
| null[]                      | null[]                | null[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                                | null[]                                       |
| undefined[]                 | undefined[]           | undefined[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                           | undefined[]                                  |
| Date[]\*\*\*                | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                       | (Date \| firestore.Timestamp)[]              |
| firestore.Timestamp[]\*\*\* | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                       | (Date \| firestore.Timestamp)[]              |
| 'ServerTimestamp'[]         | firestore.Timestamp[] | FirebaseFirestore.FieldValue (firestore.FieldValue.serverTimestamp*)[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion*) | (Date \| firestore.Timestamp)[]              |
| firestore.GeoPoint[]        | firestore.GeoPoint[]  | firestore.GeoPoint[]                                                                                                                                | firestore.GeoPoint[]                         |
| object[]                    | object[]\*\*          | object[]\*\*                                                                                                                                        | object[]\*\*                                 |
| n-dimension array           | n-dimension array     | n-dimension array \| FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*) only supported for 1st dimension array             | compare only elements in 1st dimension array |

you can union any types, it will generates the types distributively, for example type `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]` generates:

read type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

write type: `string | number | FirebaseFirestore.FieldValue | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

compare type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

In practice, any union is not recommended, data should has only one type, except `undefined` or `null` union that bear certain meaning(value missing or never initialized).

\*I am not able to narrow down FirebaseFirestore.FieldValue, you might end up using increment on array or assign server time stamp on number or array union number onto string array field, solution is welcomed.

\*\*It is not totally impossible to type object, however it is too painful to deal with right now, hence no proper deep typing support for object type, any elegant solution is welcomed. In practice, object type is not recommended, primitive data type can do thing just fine and easier to deal with in both usage and typing.

\*\*\*`Date | firestore.Timestamp`, `(Date | firestore.Timestamp)[]`, and `Date[] | firestore.Timestamp[]` unions are redundant, because `Date` and `firestore.Timestamp` generate same `read`, `write` and `compare` types.

## 🐘 Document operations: Write, Read and Listen

all the document operations api is similar to firestore [write](https://firebase.google.com/docs/firestore/manage-data/add-data), [read](https://firebase.google.com/docs/firestore/query-data/get-data) and [listen](https://firebase.google.com/docs/firestore/query-data/listen).

```ts
// import user

import { firestore } from 'firebase-admin'

// get data(type is `read type`)
user.get().then(snapshot => {
	const data = snapshot.data()
})

// listen to data(type is `read type`)
user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

const serverTimestamp = firestore.FieldValue.serverTimestamp()

// create if only exist, else fail
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.create({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else overwrite
// although it can overwrite, this is intended to use as create
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `{ merge:true }` in option as shown below.
user.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
// auto update `updatedAt`
// the merge keys are keys of `base type`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `mergeField: [<keys>]` in option as shown below.
user.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
// auto update `updatedAt`
user.update({ name: 'Michael' })

// delete document
user.delete()
```

## 🦩 Document operations: Batch

all api are similar to [firestore batch](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is member of doc, hence you don't need to define document reference.

```ts
// import user
import { firestore } from 'firebase-admin'

// implement the wrapper
const user = wrapper<User>().col('Users').doc('1234567890')

// create batch
const batch = firestore().batch()
const userBatch = user.batch(batch)

// delete document
userBatch.delete()

// create if exist, else fail
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `updatedAt` and `createdAt`
userBatch.create({ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) })

// update if exist, else fail
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
// auto update `updatedAt`
userBatch.update({ name: 'Ozai' })

//commit
batch.commit()
```

## 🐠 Document Operations: Transaction

all api are similar to [firestore transaction](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is member of doc, hence you don't need to define document reference.

```ts
// import user

user.runTransaction(async transaction => {
	// get `read type` data
	await transaction.get().then(snapshot => {
		const data = snapshot.data()
	})

	// create if only exist, else fail
	// require all members in `write type` except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	await transaction.create({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: serverTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else overwrite
	// although it can overwrite, this is intended to use as create
	// require all members in `write type` except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	user.set({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: serverTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else update
	// although it can create if not exist, this is intended to use as update
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
	// auto update `updatedAt`
	// the only value for `merge` is `true`
	// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `{ merge:true }` in option as shown below.
	await transaction.set({ name: 'Michael' }, { merge: true })

	// create if not exist, else update
	// although it can create if not exist, this is intended to use as update
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
	// auto update `updatedAt`
	// the merge keys are keys of `base type`
	// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `mergeField: [<keys>]` in option as shown below.
	await transaction.set(
		{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
		{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
	)

	// update if exist, else fail
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` or mark it as optional in `base type`
	// auto update `updatedAt`
	await transaction.update({ name: 'Michael' })
	// delete document
	await transaction.delete()

	// keep in mind you need to return promise in transaction
	// example code here is just example to show api, this is not the correct way to do it
	// refer back firestore guide https://firebase.google.com/docs/firestore/manage-data/transactions
	return Promise.resolve('')
})
```

## 🌞 Collection Operations: Query

all the api are similar to [firestore query](https://firebase.google.com/docs/firestore/query-data/queries), clauses are chain-able.

```ts
// import users

// non array data type
// the field path is the keys of the `base type`
// type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
// if type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>', the value type is same as the member's type in `compare type`
users.where('name', '==', 'John').get()
// if type of opStr is 'not-in' | 'in', the value type is array of member's type in `compare type`
users.where('name', 'in', ['John', 'Michael']).get()

// array data type
// the field path is the keys of the `base type`
// type of `opStr` is  'in' | 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()
```

## 🐳 Collection Operations: Order And Limit

all the api are similar to [firestore order and limit](https://firebase.google.com/docs/firestore/query-data/queries) with slight different, but work the same, clauses are chain-able.

The type rule obey [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations).

you may want to read this before proceed: [Firestore OrderBy and Where conflict](https://stackoverflow.com/questions/56614131/firestore-orderby-and-where-conflict) and [firestore index](https://www.fullstackfirebase.com/cloud-firestore/indexes) on how to overcome certain orderBy limitation, this is also considered into typing.

any `orderBy` that is not follow `where` clause does not abide by rule and limitation mentioned above.

Tips: to make thing easier, whenever you want to use `where` + `orderBy`, use the shorthand form (see example code below).

```ts
// import users

// the field path is the keys of the `compare type`(basically keyof base type plus `createdAt` and `updatedAt`)

// if the member value type is array, type of `opStr` is  'in' | 'array-contains'| 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()

// orderBy field path only include members that is NOT array type in `compare type`
users.orderBy('name', 'desc').limit(3).get()

// for `array-contains` and `array-contains-any` comparators, you can chain `orderBy` claus with DIFFERENT field path
users.where('beenTo', 'array-contains', 'USA').orderBy('age', 'desc').get()
users
	.where('beenTo', 'array-contains-any', ['USA', 'CHINA'])
	.orderBy('age', 'desc')
	.get()

// for '==' | 'in' comparators:
users.where('age', '==', 20).orderBy('age', 'desc').get() // no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20).orderBy('name', 'desc').get() // '==' | 'in' is order-able with DIFFERENT field name but need to use SHORTHAND form to ensure type safety
users.where('age', '==', 20, { fieldPath: 'name', directionStr: 'desc' }).get() // equivalent to where('age', '>', 20).orderBy('name','desc')
users.where('age', '==', 20, { fieldPath: 'age', directionStr: 'desc' }).get() //  no order for '==' | 'in' comparator for SAME field name

// for '<' | '<=]| '>'| '>=' comparator
users.where('age', '>', 20).orderBy('name', 'desc').get() // no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20).orderBy('age', 'desc').get() // '<' | '<=]| '>'| '>=' is oder-able with SAME field name but need to use SHORTHAND form to ensure type safety
users.where('age', '>', 20, { fieldPath: 'age', directionStr: 'desc' }).get() // equivalent to where('age', '>', 20).orderBy('age','desc')
users.where('age', '>', 20, { fieldPath: 'name', directionStr: 'desc' }).get() // no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name

// for `not-in` and `!=` comparator, you can use normal and  shorthand form for both same and different name path
// same field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('name', 'desc').get()
// different field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('age','desc')
// shorthand same field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('name','desc')

// same field path
users.where('name', '!=', 'John').orderBy('name', 'desc').get()
// different field path
users.where('name', '!=', 'John').orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc')
// shorthand same field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('name','desc')
```

## 🌺 Collection Operations: Paginate And Cursor

api are slightly different than [firestore paginate and cursor](https://firebase.google.com/docs/firestore/query-data/query-cursors), the cursors became orderBy parameter, it still work the same as firestore original api, clauses are chain-able.

```ts
// import users

// field path only include members that is NOT array type in `base type`
// field value type is the corresponding field path value type in `compare type`
// value of cursor clause is 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).offset(5) // equivalent to orderBy("age").startAt(20).offset(5)
// usage with where
users
	.where('name', '!=', 'John')
	.orderBy('age', 'desc', { clause: 'endAt', fieldValue: 50 })
// equivalent to shorthand
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc').endAt(50)
```

## 🌵 Collection Group

Api is exactly same as Collection Operations: [Query](#-collection-operations-query), [Order And Limit](#-collection-operations-order-and-limit), [Paginate And Cursor](Firelord#-collection-operations-paginate-and-cursor)

just use collection group reference instead of collection reference, refer back [Getting Started](#-getting-started) on how to create collection group reference

## 🐇 Limitation

While the wrapper try to solve as much as possible, some problem cannot be solved due to typing difficulty, or require huge effort to implement, or straight up not can be solved.

1. object data type is not supported.

2. FirebaseFirestore.FieldValue is not narrowed down.(there should be simple solution for this)

3. despite able to type [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations), there is no type safe measurement for [Query Limitation](https://firebase.google.com/docs/firestore/query-data/queries) because the number of where clause is unforeseeable.

## 🐕 Opinionated

There is one opinionated element in the wrapper, that is `createdAt` and `updatedAt` timestamp that add or update automatically.

when a document is created via `add`, `create` or `set` without option, two things will happen:

1. createdAt field path is created and the value is firestore server timestamp(current server timestamp).
2. updatedAt field path is created and the value is new Date(0), it starts at beginning of the time.

when a document is updated via `update` or `set` with option, updatedAt field path is updated and the value is firestore server timestamp.
