import { OmitKeys, ExcludePropertyKeys, RemoveArray } from './firelord'
import { FirelordFirestore } from './firelordFirestore'

// https://stackoverflow.com/questions/69724861/recursive-type-become-any-after-emit-declaration-need-implicit-solution

export type QueryCreator<
	Read extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedRead,
	Compare extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedCompare,
	WithoutArrayTypeMember extends ExcludePropertyKeys<Compare, unknown[]>
> = (
	colRefRead:
		| FirelordFirestore.CollectionReference<Read>
		| FirelordFirestore.CollectionGroup<Read>,
	query?: FirelordFirestore.Query<Read>
) => {
	firestore: typeof colRefRead.firestore
	stream: typeof colRefRead.stream
	offset: (
		offset: number
	) => ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>
	where: <
		P extends string & keyof Read,
		J extends FirelordFirestore.WhereFilterOp,
		Q extends WithoutArrayTypeMember
	>(
		fieldPath: P,
		opStr: J extends never
			? J
			: Compare[P] extends unknown[]
			? 'array-contains' | 'in' | 'array-contains-any'
			: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
		value: J extends 'not-in' | 'in'
			? Compare[P][]
			: J extends 'array-contains'
			? RemoveArray<Compare[P]>
			: Compare[P],
		orderBy?: J extends '<' | '<=' | '>=' | '>' | '==' | 'in' | '!=' | 'not-in'
			? P extends WithoutArrayTypeMember
				? {
						fieldPath: Q extends never
							? Q
							: J extends '<' | '<=' | '>=' | '>'
							? Q extends P
								? WithoutArrayTypeMember
								: never
							: J extends '==' | 'in'
							? Q extends P
								? never
								: WithoutArrayTypeMember
							: J extends 'not-in' | '!='
							? WithoutArrayTypeMember
							: never
						directionStr?: FirelordFirestore.OrderByDirection
						cursor?: {
							clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
							fieldValue:
								| Compare[J extends 'not-in' | '!=' ? Q : P]
								| FirelordFirestore.DocumentSnapshot
						}
				  }
				: never
			: never
	) => J extends '<' | '<=' | '>' | '>' | '==' | 'in'
		? OmitKeys<
				ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>,
				'orderBy'
		  >
		: ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>
	limit: (
		limit: number
	) => ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>
	limitToLast: (
		limit: number
	) => ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>
	orderBy: <P extends WithoutArrayTypeMember>(
		fieldPath: P,
		directionStr: FirelordFirestore.OrderByDirection,
		cursor?: {
			clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
			fieldValue: Compare[P] | FirelordFirestore.DocumentSnapshot
		}
	) => ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>>
	get: () => ReturnType<typeof colRefRead.get>
}

// need to make generic mandatory https://stackoverflow.com/questions/55610260/how-to-make-generics-mandatory
// however due to this is a recursive function, it is not possible
// luckily this is only used in 2 places
// but nevertheless still a potential point of failure
export const queryCreator = <
	Read extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedRead,
	Compare extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedCompare,
	WithoutArrayTypeMember extends ExcludePropertyKeys<Compare, unknown[]>
>(
	colRefRead:
		| FirelordFirestore.CollectionReference<Read>
		| FirelordFirestore.CollectionGroup<Read>,
	query?: FirelordFirestore.Query<Read>
): ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>> => {
	const orderByCreator =
		(
			colRefRead:
				| FirelordFirestore.CollectionReference<Read>
				| FirelordFirestore.CollectionGroup<Read>,
			query?: FirelordFirestore.Query<Read>
		) =>
		<P extends WithoutArrayTypeMember>(
			fieldPath: P,
			directionStr: FirelordFirestore.OrderByDirection = 'asc',
			cursor?: {
				clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
				fieldValue: Compare[P] | FirelordFirestore.DocumentSnapshot
			}
		) => {
			const ref = (query || colRefRead).orderBy(fieldPath, directionStr)

			return queryCreator<Read, Compare, WithoutArrayTypeMember>(
				colRefRead,
				cursor ? ref[cursor.clause](cursor.fieldValue) : ref
			)
		}

	return {
		firestore: colRefRead.firestore,
		stream: () => {
			return colRefRead.stream()
		},
		offset: (offset: number) => {
			return queryCreator<Read, Compare, WithoutArrayTypeMember>(
				colRefRead,
				(query || colRefRead).offset(offset)
			)
		},
		where: <
			P extends string & keyof Read,
			J extends FirelordFirestore.WhereFilterOp,
			Q extends WithoutArrayTypeMember
		>(
			fieldPath: P,
			opStr: J extends never
				? J
				: Compare[P] extends unknown[]
				? 'array-contains' | 'in' | 'array-contains-any'
				: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
			value: J extends 'not-in' | 'in'
				? Compare[P][]
				: J extends 'array-contains'
				? RemoveArray<Compare[P]>
				: Compare[P],
			orderBy?: J extends
				| '<'
				| '<='
				| '>='
				| '>'
				| '=='
				| 'in'
				| '!='
				| 'not-in'
				? P extends WithoutArrayTypeMember
					? {
							fieldPath: Q extends never
								? Q
								: J extends '<' | '<=' | '>=' | '>'
								? Q extends P
									? WithoutArrayTypeMember
									: never
								: J extends '==' | 'in'
								? Q extends P
									? never
									: WithoutArrayTypeMember
								: J extends 'not-in' | '!='
								? WithoutArrayTypeMember
								: never
							directionStr?: FirelordFirestore.OrderByDirection
							cursor?: {
								clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
								fieldValue:
									| Compare[J extends 'not-in' | '!=' ? Q : P]
									| FirelordFirestore.DocumentSnapshot
							}
					  }
					: never
				: never
		) => {
			const ref = (query || colRefRead).where(fieldPath, opStr, value)

			const queryRef = queryCreator(colRefRead, ref)

			const { orderBy: orderBy1, ...rest } = orderBy
				? orderByCreator(colRefRead, ref)(
						orderBy.fieldPath,
						orderBy.directionStr,
						orderBy.cursor
				  )
				: queryRef

			return (orderBy ? rest : queryRef) as J extends
				| '<'
				| '<='
				| '>'
				| '>'
				| '=='
				| 'in'
				? typeof rest
				: typeof queryRef
		},
		limit: (limit: number) => {
			return queryCreator<Read, Compare, WithoutArrayTypeMember>(
				colRefRead,
				(query || colRefRead).limit(limit)
			)
		},
		limitToLast: (limit: number) => {
			return queryCreator<Read, Compare, WithoutArrayTypeMember>(
				colRefRead,
				(query || colRefRead).limitToLast(limit)
			)
		},
		orderBy: orderByCreator(colRefRead),
		get: () => {
			return (query || colRefRead).get()
		},
	}
}
