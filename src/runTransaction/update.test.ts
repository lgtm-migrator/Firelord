import { runTransaction } from '.'

import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { IsTrue, IsSame, TransactionUpdate } from '../types'
import { setDoc } from '../operations'
import { deleteField } from '../fieldValue'
import { updateCreator } from './update'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()
const userRef = userRefCreator()

describe('test update transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof updateCreator>
		type B = TransactionUpdate
		IsTrue<IsSame<A, B>>()
	})

	it('test functionality', async () => {
		const docRef = userRef.doc('FirelordTest', 'updateTransactionTestCase')
		const docRef2 = userRef.doc('FirelordTest', 'updateTransactionTestCase2')
		const docRef3 = userRef.doc('FirelordTest', 'updateTransactionTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		const p1 = setDoc(docRef, generateRandomData())
		const p2 = setDoc(docRef2, generateRandomData())
		const p3 = setDoc(docRef3, generateRandomData())
		await Promise.all([p1, p2, p3])
		await runTransaction(async transaction => {
			transaction.update(docRef, data)
			transaction.update(docRef2, data2)
			transaction.update(docRef3, data3)
		})
		const p4 = readThenCompareWithWriteData(data, docRef)
		const p5 = readThenCompareWithWriteData(data2, docRef2)
		const p6 = readThenCompareWithWriteData(data3, docRef3)
		await Promise.all([p4, p5, p6])
	})

	it('test same path, delete field, in hybrid', async () => {
		const data = generateRandomData()
		const ref = userRef.doc(
			'FirelordTest',
			'updateTransactionSpecificFieldTestCase'
		)
		await setDoc(ref, data)
		const date = new Date()
		const arr = [{ g: false, h: date, m: 9 }]
		const num = Math.random()
		await runTransaction(async transaction => {
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

	it('test empty object', async () => {
		const docRef = userRef.doc('FirelordTest', 'updateTransactionTestCaseEmpty')
		await setDoc(docRef, generateRandomData())
		expect.assertions(1)
		await runTransaction(async transaction => {
			const result = transaction.update(
				docRef,
				// @ts-expect-error
				{}
			)
			expect(result).toBe(undefined)
		})
	})
})
