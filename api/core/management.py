import csv
import json
import os
from django.db.models.signals import post_migrate
from core.models import Family

def csv_parser(sender, **kwargs):
    with open(os.path.join(os.path.dirname(os.path.dirname(__file__)),'core\\imports\\takehome_test_data.csv')) as f:
        a = [{k: v for k, v in row.items()}
        for row in csv.DictReader(f, skipinitialspace=False)]
    for d in a:
        d.update({"edited": { "monthlyPayment": "False", "lumpSumPayment": "False", "interestRate": "False"}})
        d['Monthly Payment'] = int(d['Monthly Payment'])
        
        if d['Lump Sum Payment'] == '':
            d['Lump Sum Payment'] = 0
        else:
            d['Lump Sum Payment'] = int(d['Lump Sum Payment'])

        if d['Total'] == '':
            d['Total'] = 0
        else:
            d['Total'] = int(d['Total'])    
        
        d['Interest Rate'] = int(d['Interest Rate'].split('%')[0])

    family = Family(id="0")
    a_str = json.dumps(a).replace('Year','year').replace('Month','month').replace('monthly Payment','monthlyPayment').replace('Lump Sum Payment','lumpSumPayment').replace('Interest Rate','interestRate').replace('Total','total')
    family.data['rows'] = json.loads(a_str)
    family.save()

# https://medium.com/@taranjeet/django-implementing-view-only-permissions-d3f5e6371b3
post_migrate.connect(csv_parser)