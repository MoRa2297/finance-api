import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ColorType {
  @Field(() => Int)
  id: number;

  @Field()
  hexCode: string;
}

@ObjectType()
export class CategoryIconType {
  @Field(() => Int)
  id: number;

  @Field()
  iconName: string;
}

@ObjectType()
export class BankTypeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  imageUrl: string;
}

@ObjectType()
export class BankAccountTypeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class CardTypeType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  imageUrl: string;
}
