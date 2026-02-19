import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
    @Field(() => Int)
    id: number;

    @Field()
    email: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    surname?: string;

    @Field({ nullable: true })
    birthDate?: Date;

    @Field({ nullable: true })
    sex?: string;

    @Field({ nullable: true })
    imageUrl?: string;

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
