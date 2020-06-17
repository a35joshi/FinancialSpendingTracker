from django.db import models
import jsonfield

def initial_row_data():
    response = {}
    response['rows'] = list({
        "year": "",
        "month": "",
        "monthlyPayment": 0,
        "lumpSumPayment": 0,
        "interestRate":0,
        "total":0,
        "edited":{ "monthlyPayment": False, "lumpSumPayment": False, "interestRate": False }
    })
    return response


# Create your models here.
class Family(models.Model):
    data = jsonfield.JSONField(default=initial_row_data) 
    
