import { MetaType } from './metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from './alias'
import { CursorType } from './cursor'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	OpStr extends WhereFilterOp,
	Value
> = {
	type: 'where'
	fieldPath: FieldPath
	opStr: OpStr
	value: Value
}

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends OrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	value: Value
}

export type OffsetConstraint = {
	type: 'offset'
	value: number
}

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	values: Values
}

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<keyof T['compare'] & string, OrderByDirection | undefined>
	| OffsetConstraint
