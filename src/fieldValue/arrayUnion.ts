import { FieldValue } from 'firebase-admin/firestore'
import { ArrayRemoveOrUnion } from '../types'

/**
 * Returns a special value that can be used with set(), create() or update()
 * that tells the server to union the given elements with any array value
 * that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements The elements to union into the array.
 * @return The FieldValue sentinel for use in a call to set(), create() or
 * update().
 */
// @ts-expect-error
export const arrayUnion: ArrayRemoveOrUnion = (...elements) => {
	// * web don't have empty array issue
	const filler = elements.length === 0 ? [[]] : elements
	const ref = FieldValue.arrayUnion(...filler)
	// @ts-expect-error
	ref['Firelord.ArrayFieldValue'] = elements

	return ref
}
