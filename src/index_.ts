import {
	OmitKeys,
	PartialNoImplicitUndefinedAndNoExtraMember,
	ExcludePropertyKeys,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { QueryCreator } from './queryCreator'

export type firelord = (firestore: FirelordFirestore.Firestore) => <
	T extends {
		colPath: string
		docPath: string
		read: FirelordFirestore.DocumentData & FirelordFirestore.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData &
			FirelordFirestore.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData &
			FirelordFirestore.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	} = never
>() => {
	col: (collectionPath: T['colPath']) => {
		firestore: FirelordFirestore.FirebaseFirestore
		stream: () => FirelordFirestore.Stream
		offset: (offset: number) => {
			firestore: FirelordFirestore.FirebaseFirestore
			stream: () => FirelordFirestore.Stream
			offset: ReturnType<
				QueryCreator<
					T['read'],
					T['compare'],
					ExcludePropertyKeys<T['compare'], unknown[]>
				>
			>
			where: <
				P extends string & keyof T['read'],
				J extends FirelordFirestore.WhereFilterOp,
				Q extends ExcludePropertyKeys<T['compare'], unknown[]>
			>(
				fieldPath: P,
				opStr: J extends never
					? J
					: T['compare'][P] extends unknown[]
					? 'array-contains' | 'in' | 'array-contains-any'
					: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in',
				value: J extends 'in' | 'not-in'
					? T['compare'][P][]
					: J extends 'array-contains'
					? import('./firelord').RemoveArray<T['compare'][P]>
					: T['compare'][P],
				orderBy?:
					| (J extends '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in'
							? P extends ExcludePropertyKeys<T['compare'], unknown[]>
								? {
										fieldPath: Q extends never
											? Q
											: J extends '<' | '<=' | '>=' | '>'
											? Q extends P
												? ExcludePropertyKeys<T['compare'], unknown[]>
												: never
											: J extends '==' | 'in'
											? Q extends P
												? never
												: ExcludePropertyKeys<T['compare'], unknown[]>
											: J extends '!=' | 'not-in'
											? ExcludePropertyKeys<T['compare'], unknown[]>
											: never
										directionStr?:
											| FirelordFirestore.OrderByDirection
											| undefined
										cursor?:
											| {
													clause:
														| 'startAt'
														| 'startAfter'
														| 'endAt'
														| 'endBefore'
													fieldValue:
														| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
														| T['compare'][J extends '!=' | 'not-in' ? Q : P]
											  }
											| undefined
								  }
								: never
							: never)
					| undefined
			) => J extends '<' | '<=' | '==' | '>' | 'in'
				? OmitKeys<
						ReturnType<
							QueryCreator<
								T['read'],
								T['compare'],
								ExcludePropertyKeys<T['compare'], unknown[]>
							>
						>,
						'orderBy'
				  >
				: ReturnType<
						QueryCreator<
							T['read'],
							T['compare'],
							ExcludePropertyKeys<T['compare'], unknown[]>
						>
				  >
			limit: (
				limit: number
			) => ReturnType<
				QueryCreator<
					T['read'],
					T['compare'],
					ExcludePropertyKeys<T['compare'], unknown[]>
				>
			>
			limitToLast: (
				limit: number
			) => ReturnType<
				QueryCreator<
					T['read'],
					T['compare'],
					ExcludePropertyKeys<T['compare'], unknown[]>
				>
			>
			orderBy: <P_1 extends ExcludePropertyKeys<T['compare'], unknown[]>>(
				fieldPath: P_1,
				directionStr: FirelordFirestore.OrderByDirection,
				cursor?:
					| {
							clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
							fieldValue:
								| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
								| T['compare'][P_1]
					  }
					| undefined
			) => ReturnType<
				QueryCreator<
					T['read'],
					T['compare'],
					ExcludePropertyKeys<T['compare'], unknown[]>
				>
			>
			get: () => Promise<FirelordFirestore.QuerySnapshot<T['read']>>
		}
		where: <
			P extends string & keyof T['read'],
			J extends FirelordFirestore.WhereFilterOp,
			Q extends ExcludePropertyKeys<T['compare'], unknown[]>
		>(
			fieldPath: P,
			opStr: J extends never
				? J
				: T['compare'][P] extends unknown[]
				? 'array-contains' | 'in' | 'array-contains-any'
				: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in',
			value: J extends 'in' | 'not-in'
				? T['compare'][P][]
				: J extends 'array-contains'
				? import('./firelord').RemoveArray<T['compare'][P]>
				: T['compare'][P],
			orderBy?:
				| (J extends '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in'
						? P extends ExcludePropertyKeys<T['compare'], unknown[]>
							? {
									fieldPath: Q extends never
										? Q
										: J extends '<' | '<=' | '>=' | '>'
										? Q extends P
											? ExcludePropertyKeys<T['compare'], unknown[]>
											: never
										: J extends '==' | 'in'
										? Q extends P
											? never
											: ExcludePropertyKeys<T['compare'], unknown[]>
										: J extends '!=' | 'not-in'
										? ExcludePropertyKeys<T['compare'], unknown[]>
										: never
									directionStr?: FirelordFirestore.OrderByDirection | undefined
									cursor?:
										| {
												clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
												fieldValue:
													| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
													| T['compare'][J extends '!=' | 'not-in' ? Q : P]
										  }
										| undefined
							  }
							: never
						: never)
				| undefined
		) => J extends '<' | '<=' | '==' | '>' | 'in'
			? OmitKeys<
					ReturnType<
						QueryCreator<
							T['read'],
							T['compare'],
							ExcludePropertyKeys<T['compare'], unknown[]>
						>
					>,
					'orderBy'
			  >
			: ReturnType<
					QueryCreator<
						T['read'],
						T['compare'],
						ExcludePropertyKeys<T['compare'], unknown[]>
					>
			  >
		limit: (
			limit: number
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		limitToLast: (
			limit: number
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		orderBy: <P_1 extends ExcludePropertyKeys<T['compare'], unknown[]>>(
			fieldPath: P_1,
			directionStr: FirelordFirestore.OrderByDirection,
			cursor?:
				| {
						clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
						fieldValue:
							| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
							| T['compare'][P_1]
				  }
				| undefined
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		get: () => Promise<FirelordFirestore.QuerySnapshot<T['read']>>
		parent: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData> | null
		path: string
		id: string
		listDocuments: () => Promise<
			FirelordFirestore.DocumentReference<T['read']>[]
		>
		doc: (documentPath: T['docPath']) => {
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
				data: OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
			) => Promise<FirelordFirestore.WriteResult>
			set: <
				J_1 extends Partial<OmitKeys<T['write'], 'createdAt' | 'updatedAt'>>,
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
					? OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
					: Z['merge'] extends true
					? PartialNoImplicitUndefinedAndNoExtraMember<
							OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
							J_1
					  >
					: Z['mergeField'] extends Exclude<
							keyof T['write'],
							'createdAt' | 'updatedAt'
					  >[]
					? PartialNoImplicitUndefinedAndNoExtraMember<
							OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
							J_1
					  >
					: OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
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
				create: (
					data: OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
				) => FirelordFirestore.WriteBatch
			}
			runTransaction: (
				callback: (transaction: {
					create: (
						data: OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
					) => FirelordFirestore.Transaction
					set: <
						J_4 extends Partial<
							OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
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
							? OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
							: PartialNoImplicitUndefinedAndNoExtraMember<
									OmitKeys<T['write'], 'createdAt' | 'updatedAt'>,
									J_4
							  >,
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
		add: (
			data: OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
		) => Promise<
			FirelordFirestore.DocumentReference<
				OmitKeys<T['write'], 'createdAt' | 'updatedAt'>
			>
		>
	}
	colGroup: (collectionPath: T['colPath']) => {
		firestore: FirelordFirestore.FirebaseFirestore
		stream: () => FirelordFirestore.Stream
		offset: ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		where: <
			P extends string & keyof T['read'],
			J extends FirelordFirestore.WhereFilterOp,
			Q extends ExcludePropertyKeys<T['compare'], unknown[]>
		>(
			fieldPath: P,
			opStr: J extends never
				? J
				: T['compare'][P] extends unknown[]
				? 'array-contains' | 'in' | 'array-contains-any'
				: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in',
			value: J extends 'in' | 'not-in'
				? T['compare'][P][]
				: J extends 'array-contains'
				? import('./firelord').RemoveArray<T['compare'][P]>
				: T['compare'][P],
			orderBy?:
				| (J extends '<' | '<=' | '==' | '!=' | '>=' | '>' | 'in' | 'not-in'
						? P extends ExcludePropertyKeys<T['compare'], unknown[]>
							? {
									fieldPath: Q extends never
										? Q
										: J extends '<' | '<=' | '>=' | '>'
										? Q extends P
											? ExcludePropertyKeys<T['compare'], unknown[]>
											: never
										: J extends '==' | 'in'
										? Q extends P
											? never
											: ExcludePropertyKeys<T['compare'], unknown[]>
										: J extends '!=' | 'not-in'
										? ExcludePropertyKeys<T['compare'], unknown[]>
										: never
									directionStr?: FirelordFirestore.OrderByDirection | undefined
									cursor?:
										| {
												clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
												fieldValue:
													| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
													| T['compare'][J extends '!=' | 'not-in' ? Q : P]
										  }
										| undefined
							  }
							: never
						: never)
				| undefined
		) => J extends '<' | '<=' | '==' | '>' | 'in'
			? OmitKeys<
					ReturnType<
						QueryCreator<
							T['read'],
							T['compare'],
							ExcludePropertyKeys<T['compare'], unknown[]>
						>
					>,
					'orderBy'
			  >
			: ReturnType<
					QueryCreator<
						T['read'],
						T['compare'],
						ExcludePropertyKeys<T['compare'], unknown[]>
					>
			  >
		limit: (
			limit: number
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		limitToLast: (
			limit: number
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		orderBy: <P_1 extends ExcludePropertyKeys<T['compare'], unknown[]>>(
			fieldPath: P_1,
			directionStr: FirelordFirestore.OrderByDirection,
			cursor?:
				| {
						clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
						fieldValue:
							| FirelordFirestore.DocumentSnapshot<FirelordFirestore.DocumentData>
							| T['compare'][P_1]
				  }
				| undefined
		) => ReturnType<
			QueryCreator<
				T['read'],
				T['compare'],
				ExcludePropertyKeys<T['compare'], unknown[]>
			>
		>
		get: () => Promise<FirelordFirestore.QuerySnapshot<T['read']>>
	}
}
