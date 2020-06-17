import graphene
import core.schema

class Query(core.schema.FamilyQuery, graphene.ObjectType):
    pass

class Mutation(core.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)