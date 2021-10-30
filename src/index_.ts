import {
	OmitKeys,
	PartialNoImplicitUndefinedAndNoExtraMember,
	ExcludePropertyKeys,
	Firelord,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { QueryCreator } from './queryCreator'

type doc<
	T extends {
		colPath: string
		docPath: string
		colGroupPath: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	}
> = (
	documentPath: T['docPath'],
	docRef?: FirebaseFirestore.DocumentReference
) => {
	firestore: FirelordFirestore.FirebaseFirestore
	id: string
	parent: FirelordFirestore.CollectionReference<T['read']>
	path: string
	listCollections: () => Promise<
		FirelordFirestore.CollectionReference<FirelordFirestore.DocumentData>[]
	>
	isEqual: (
		other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
	) => boolean
	onSnapshot: (
		next?:
			| ((snapshot: FirelordFirestore.DocumentSnapshot<T['read']>) => void)
			| undefined,
		error?: ((error: Error) => void) | undefined
	) => () => void
	create: (
		data: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
	) => Promise<FirelordFirestore.WriteResult>
	set: <
		J_1 extends Partial<OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>>,
		Z extends {
			merge?: true | undefined
			mergeField?:
				| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
				| undefined
		}
	>(
		data: J_1 extends never
			? J_1
			: Z extends undefined
			? OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
			: Z['merge'] extends true
			? PartialNoImplicitUndefinedAndNoExtraMember<
					OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
					J_1
			  >
			: Z['mergeField'] extends Exclude<
					keyof T['write'],
					'createdAt' | 'updatedAt'
			  >[]
			? PartialNoImplicitUndefinedAndNoExtraMember<
					OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
					J_1
			  >
			: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
		options?: Z | undefined
	) => Promise<FirelordFirestore.WriteResult>
	update: <
		J_2 extends Partial<OmitKeys<T['write'], 'createdAt' | 'updatedAt'>>
	>(
		data: J_2 extends never
			? J_2
			: PartialNoImplicitUndefinedAndNoExtraMember<
					OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
					J_2
			  >
	) => Promise<FirelordFirestore.WriteResult>
	get: () => Promise<FirelordFirestore.DocumentSnapshot<T['read']>>
	delete: () => Promise<FirelordFirestore.WriteResult>
	batch: (batch: FirelordFirestore.WriteBatch) => {
		commit: () => Promise<FirelordFirestore.WriteResult[]>
		delete: () => FirelordFirestore.WriteBatch
		update: <
			J_3 extends Partial<OmitKeys<T['write'], 'createdAt' | 'updatedAt'>>
		>(
			data: J_3 extends never
				? J_3
				: PartialNoImplicitUndefinedAndNoExtraMember<
						OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
						J_3
				  >
		) => FirelordFirestore.WriteBatch
		set: <
			J_7 extends Partial<
				OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
			>,
			Z_2 extends {
				merge?: true | undefined
				mergeField?:
					| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
					| undefined
			}
		>(
			data: J_7 extends never
				? J_7
				: Z_2 extends undefined
				? OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
				: Z_2['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
						J_7
				  >
				: Z_2['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
						J_7
				  >
				: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
			options?: Z_2 | undefined
		) => FirelordFirestore.WriteBatch
		create: (
			data: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
		) => FirelordFirestore.WriteBatch
	}
	runTransaction: (
		callback: (transaction: {
			create: (
				data: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
			) => FirelordFirestore.Transaction
			set: <
				J_4 extends Partial<
					OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
				>,
				Z_1 extends {
					merge?: true | undefined
					mergeField?:
						| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
						| undefined
				}
			>(
				data: J_4 extends never
					? J_4
					: Z_1 extends undefined
					? OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
					: Z_1['merge'] extends true
					? PartialNoImplicitUndefinedAndNoExtraMember<
							OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
							J_4
					  >
					: Z_1['mergeField'] extends Exclude<
							keyof T['write'],
							'createdAt' | 'updatedAt'
					  >[]
					? PartialNoImplicitUndefinedAndNoExtraMember<
							OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
							J_4
					  >
					: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>,
				options?: Z_1 | undefined
			) => FirelordFirestore.Transaction
			update: <
				J_5 extends Partial<OmitKeys<T['write'], 'createdAt' | 'updatedAt'>>
			>(
				data: J_5 extends never
					? J_5
					: PartialNoImplicitUndefinedAndNoExtraMember<
							OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
							J_5
					  >
			) => FirelordFirestore.Transaction
			delete: () => FirelordFirestore.Transaction
			get: () => Promise<FirelordFirestore.DocumentSnapshot<T['read']>>
			getAll: <
				J_6 extends FirelordFirestore.DocumentData = FirelordFirestore.DocumentData
			>(
				documentReferences: J_6[],
				options: FirelordFirestore.ReadOptions
			) => Promise<FirelordFirestore.DocumentSnapshot<J_6>[]>
		}) => Promise<unknown>
	) => void
}

export type firelord = (firestore: FirelordFirestore.Firestore) => <
	T extends {
		colPath: string
		docPath: string
		colGroupPath: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	} = never
>() => {
	col: (collectionPath: T['colPath']) => {
		parent: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData> | null
		path: string
		id: string
		listDocuments: () => Promise<
			FirelordFirestore.DocumentReference<T['read']>[]
		>
		doc: doc<T>
		add: (
			data: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
		) => Promise<ReturnType<doc<T>>>
	} & ReturnType<
		QueryCreator<
			T['read'],
			T['compare'],
			ExcludePropertyKeys<T['compare'], unknown[]>
		>
	>
	colGroup: (
		collectionPath: T['colGroupPath']
	) => ReturnType<
		QueryCreator<
			T['read'],
			T['compare'],
			ExcludePropertyKeys<T['compare'], unknown[]>
		>
	>
	fieldValue: {
		increment: (value: number) => Firelord.NumberMasked
		serverTimestamp: () => Firelord.ServerTimestampMasked
		arrayUnion: <T>(...values: T[]) => Firelord.ArrayMasked<T>
		arrayRemove: <T>(...values: T[]) => Firelord.ArrayMasked<T>
	}
}
