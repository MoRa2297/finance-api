import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  surname: string | null;

  @Field(() => Date, { nullable: true })
  birthDate: Date | null;

  @Field(() => String, { nullable: true })
  sex: string | null;

  @Field(() => String, { nullable: true })
  imageUrl: string | null;

  @Field()
  acceptedTerms: boolean;

  @Field()
  createdDate: Date;

  @Field()
  updateDate: Date;
}

@ObjectType()
export class AuthType {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class MessageType {
  @Field()
  message: string;
}
