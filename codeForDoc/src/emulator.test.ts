import {
	setDoc,
	updateDoc,
	deleteField,
	getFirelord,
	addDoc,
	deleteDoc,
	getDoc,
	getDocs,
	query,
	where,
	onSnapshot,
	runTransaction,
	writeBatch,
	createDoc,
	orderBy,
	endAt,
	startAt,
	Bytes,
} from 'firelord'
import {
	User,
	readThenCompareWithWriteData,
	generateRandomData,
	compareWriteDataWithDocSnapData,
} from './utilForTests'

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'any' })

const firestore = getFirestore()
const userRef = getFirelord<User>(firestore, 'topLevel', 'Users')

describe('test whether works with rules-unit-testing', () => {
	it('test updateDoc, setDoc, and delete field', async () => {
		const data = generateRandomData()
		const ref = userRef.doc('FirelordTest', 'updateDocSpecificFieldTestCase')
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await updateDoc(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
	it('test addDoc and deleteDoc', async () => {
		const data = generateRandomData()
		const ref = userRef.collection('FirelordTest')
		const docRef = await addDoc(ref, data)
		await readThenCompareWithWriteData(data, docRef)
		await deleteDoc(docRef)
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists).toBe(false)
	})
	it('test createDoc and deleteDoc', async () => {
		const data = generateRandomData()
		const docRef = userRef.doc('FirelordTest', 'emulatorCreateDocTest')
		await createDoc(docRef, data)
		await readThenCompareWithWriteData(data, docRef)
		await deleteDoc(docRef)
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists).toBe(false)
	})
	it('test getDocs', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		await setDoc(docRef, data)
		expect.hasAssertions()
		const querySnapshot = await getDocs(
			query(
				userRef.collectionGroup(),
				where('a.b.c', '==', data.a.b.c as number)
			)
		)
		const queryDocumentSnapshot = querySnapshot.docs.filter(
			doc => doc.id === docId
		)[0]
		expect(querySnapshot.docs.length).toBe(1)
		expect(queryDocumentSnapshot).not.toBe(undefined)
		if (queryDocumentSnapshot) {
			await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
		}
	})

	it('test onSnapshot', done => {
		const docId = 'onSnapshotWithOptionQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				query(
					userRef.collection('FirelordTest'),
					where('a.b.c', '==', data.a.b.c as number)
				),
				async querySnapshot => {
					const queryDocumentSnapshot = querySnapshot.docs.filter(
						doc => doc.id === docId
					)[0]
					expect(querySnapshot.docs.length).toBe(1)
					expect(queryDocumentSnapshot).not.toBe(undefined)
					if (queryDocumentSnapshot) {
						await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
					}
					unsub()
					done()
				},
				() => {}
			)
		})
	})
	it('test transaction, update, delete field', async () => {
		const data = generateRandomData()
		const ref = userRef.doc(
			'FirelordTest',
			'updateTransactionSpecificFieldTestCase'
		)
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await runTransaction(firestore, async transaction => {
			await transaction.update(ref, {
				a: { 'i.j': deleteField() },
				'a.b': { f: arr },
				'a.b.c': num,
			})
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await readThenCompareWithWriteData(data, ref)
	})
	it('test transaction delete', async () => {
		const docRef = userRef.doc('FirelordTest', 'setTransactionTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(firestore, async transaction => {
			transaction.delete(docRef)
		})
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists).toBe(false)
	})
	it('test transaction read functionality', async () => {
		const docRef = userRef.doc('FirelordTest', 'setTransactionTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(firestore, async transaction => {
			const docSnap = await transaction.get(docRef)
			compareWriteDataWithDocSnapData(data, docSnap)
		})
	})
	it('test batch update, delete field', async () => {
		const batch = writeBatch(firestore)
		const data = generateRandomData()
		const ref = userRef.doc('FirelordTest', 'updateBatchSpecificFieldTestCase')
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		batch.update(ref, {
			a: { 'i.j': deleteField() },
			'a.b': { f: arr },
			'a.b.c': num,
		})
		data.a.i.j = undefined as unknown as typeof data.a.i.j
		data.a.b.f = arr
		data.a.b.c = num
		await batch.commit()
		await readThenCompareWithWriteData(data, ref)
	})
	it('test batch delete functionality', async () => {
		const batch = writeBatch(firestore)
		const docRef = userRef.doc('FirelordTest', 'setBatchTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		batch.delete(docRef)
		await batch.commit()
		const docSnap = await getDoc(docRef)
		expect(docSnap.exists).toBe(false)
	})
	it('test batch set functionality', async () => {
		const batch = writeBatch(firestore)
		const ref = userRef.doc('FirelordTest', 'setBatchTestMergeCase')
		const data = generateRandomData()
		await setDoc(ref, data)
		batch.set(ref, { a: { b: { f: [] } } }, { mergeFields: ['a.b.f'] })
		await batch.commit()
		data.a.b.f = []
		await readThenCompareWithWriteData(data, ref)
	})
	it('cursor test', async () => {
		const d1 = generateRandomData()
		const d2 = generateRandomData()
		const d3 = generateRandomData()
		const d4 = generateRandomData()
		const p1 = setDoc(userRef.doc('FirelordTest', 'emulatorCursorTest1'), d1)
		const p2 = setDoc(userRef.doc('FirelordTest', 'emulatorCursorTest2'), d2)
		const p3 = setDoc(userRef.doc('FirelordTest', 'emulatorCursorTest3'), d3)
		const p4 = setDoc(userRef.doc('FirelordTest', 'emulatorCursorTest4'), d4)

		await Promise.all([p1, p2, p3, p4])

		expect.assertions(2)

		const p5 = getDocs(
			query(userRef.collectionGroup(), orderBy('age'), endAt(d3.age as number))
		).then(querySnapshot => {
			const doc = querySnapshot.docs[querySnapshot.docs.length - 1]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d3.age)
			}
		})
		const p6 = getDocs(
			query(
				userRef.collectionGroup(),
				orderBy('age'),
				startAt(d1.age as number)
			)
		).then(querySnapshot => {
			const doc = querySnapshot.docs[0]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d1.age)
			}
		})

		await Promise.all([p5, p6])
	})
})
