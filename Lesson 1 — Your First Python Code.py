
a = 10
b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)



print(10 // 3)
print(10 % 3)
print(10 ** 3)

# Don't just read the lessons. Write the code yourself.

# Create a Python program that asks for:

# Name
# Age
# City
# Monthly salary

# Then prints something like:


# My name is Suleman.
# I am 28 years old.
# I live in Riyadh.
# My monthly salary is 5000 SAR.



name= input('What is your name ?')
age= int(input('What is your age ?'))
city= input('In which city do u live?')
salary=float( input('What is your salary?'))
yearly_salary=12*salary
monthly_salary_in_pk_rs= 74.50*salary;
yearly_salary_in_pk_rs= monthly_salary_in_pk_rs*12

print(f'My name is {name}')
print(f'I am {age} years old')
print(f'I live in {city}')
print(f'My monthly salary is {salary} SAR')
print(f'My yearly salary is {yearly_salary} SAR')
print(f'My monthly salary in Pakistani Rupees {monthly_salary_in_pk_rs} Rs')
print(f'My yearly salary in Pakistani Rupees {yearly_salary_in_pk_rs} Rs')
