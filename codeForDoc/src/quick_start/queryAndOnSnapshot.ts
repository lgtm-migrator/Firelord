import { example } from './create_firelord_ref'
import {
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
} from 'firelord'
//
getDocs(
	query(
		example.collection(),
		where('f.h', '>', 1010 as const),
		orderBy('f.h'),
		limit(10)
	)
).then(querySnapshot => {
	querySnapshot.docChanges().forEach(docChange => {
		docChange.doc
		docChange.type
		docChange.oldIndex
		docChange.newIndex
		docChange.isEqual(docChange)
	})
	querySnapshot.forEach(docSnapshot => {})

	querySnapshot.docs.forEach(docSnapshot => {})
})

const unsub = onSnapshot(
	query(
		example.collectionGroup(),
		where('b.d', 'array-contains', { e: 'hello' }),
		orderBy('f.g'),
		startAfter(new Date())
	),
	querySnapshot => {
		querySnapshot.forEach(docSnapshot => {
			const data = docSnapshot.data()
		})
	},
	error => {}
)
