from graphene_django import DjangoObjectType
from graphene.types import generic
from .models import Family
import graphene
from jsonfield import JSONField
from graphene_django.converter import convert_django_field

@convert_django_field.register(JSONField)
def convert_json_field_to_string(field, registry=None):
    return generic.GenericScalar()

class FamilyType(DjangoObjectType):   
    class Meta:    
        model = Family

class FamilyQuery(graphene.ObjectType):
    family = graphene.Field(FamilyType, id=graphene.Int())
    all_families = graphene.List(FamilyType)

    def resolve_family(self, info, id):
        return Family.objects.get(id=id)

    def resolve_all_families(self, info, **kwargs):
        return Family.objects.all()

class RecalculateTotalsMutation(graphene.Mutation):
    class Arguments:
        data = generic.GenericScalar()
        id = graphene.ID()

    family = graphene.Field(FamilyType)

    def mutate(self, info, data, id):
        family = Family.objects.get(id=id)
        for row in family.data['rows']:
            row['total'] = row['monthlyPayment'] + row['lumpSumPayment']
        family.save()
        return RecalculateTotalsMutation(family=family)

class IncreaseMonthlyPaymentsMutation(graphene.Mutation):
    class Arguments:
        data = generic.GenericScalar()
        id = graphene.ID()

    family = graphene.Field(FamilyType)

    def mutate(self, info, data, id):
        family = Family.objects.get(id=id)
        count = 0
        for row in family.data['rows']:
            if(count % 2 == 0):
                row['monthlyPayment'] = round(row['monthlyPayment']*1.1)
                row['edited']['monthlyPayment'] = "True"
            count = count + 1;    
        family.save()
        return RecalculateTotalsMutation(family=family)

class SampleMutation(graphene.Mutation):
    # This is a sample mutation that takes an ID and data object.
    # Create your own mutations for the test.
    class Arguments:
        data = generic.GenericScalar()
        id = graphene.ID()

    family = graphene.Field(FamilyType)

    def mutate(self, info, data, id):
        family = Family.objects.get(id=id)
        # change family object in DB here
        # More info on DB ORM here - https://docs.djangoproject.com/en/3.0/topics/db/queries/
        # save changes to DB.
        family.save()
        return SampleMutation(family=family)


class Mutation(graphene.ObjectType):
    sample_mutation = SampleMutation.Field()
    recalculate_totals_mutation = RecalculateTotalsMutation.Field()
    increase_monthly_payments_mutation = IncreaseMonthlyPaymentsMutation.Field()


    