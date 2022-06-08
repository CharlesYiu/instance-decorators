# Instance Decorators (place: [npm](https://www.npmjs.com/package/instance-decorators) | [git](https://github.com/charlesyiu/instance-decorators))
This npm library enables users to create decorators that run when the class constructs.
```console
$ npm install instance-decorators
```
## Pages (or [skip](#some-use-cases))
- [Some use cases](#some-use-cases)
    - [1. Using it for providing values to the user](#1-using-it-for-providing-values-to-the-user)
    - [2. Using it for making 'this' readonly](#2-using-it-for-making-this-readonly)
    - [3. Using it for processing values that were set the first time](#3-using-it-for-processing-values-that-were-set-the-first-time)
- [Guide](#guide)
    - [Step 1](#step-1)
    - [Step 2](#step-2)
    - [Step 3](#step-3)
    - [Step 4](#step-4)
- [Example: Creating an @AutoRun decorator](#example-creating-an-autorun-decorator-finished-productfinished-product)
    - [What we want it to do](#what-we-want-it-to-do)
    - [Creating the decorator factory](#creating-the-decorator-factory)
    - [Adding code for the decorator](#adding-code-for-the-decorator)
    - [Using the decorator](#using-the-decorator)
    - [Finished product](#finished-product)
- [Documentation](#documentation)
    - [@Instance()](#instance)
    - [Instance(action: InstanceAction): InstanceDecorator](#instanceaction-instanceaction-instancedecorator)
    - [Imports](#imports)
## Some use cases
There are a huge range of applicable reasons and places where using this library benifits you (and your library/frameworks's users) including..
### 1. Using it for providing values to the user
```TypeScript
function database(name?: string): typeof InstanceDecorator {
    return Instance(function(values: Values, variableName: string) {
        values[variableName] = db.get(name ?? variableName)
    })
}

@Instance()
class Values {
    @database("value")
    value: string
}
```
### 2. Using it for making 'this' readonly
```TypeScript
const FreezedBind = Instance(function(values: Values, name: string, descriptor: PropertyDescriptor) {
    const valuesClone = structuredClone(values)
    Object.freeze(valuesClone)
    values[name].bind(valuesClone)()
})

@Instance()
class Values {
    @FreezedBind
    method() {
        ...
    }
}
```
### 3. Using it for processing values that were set the first time
```TypeScript
function Process<T>(processor: ((value: T) => T)): typeof InstanceDecorator {
    return Instance(function(values: Values, name: string) {
        let notProcessed = true
        let value = undefined
        Object.defineProperty(values, name, {
            get: function() { return value },
            set: function(newValue) {
                if (notProcessed) {
                    value = processor(newValue)
                    notProcessed = false
                } else value = newValue
            }
        })
    })
}

@Instance()
class Values {
    @Process<string>(function(value: string): string {
        console.log("processed " + value)
        return value
    })
    property: string
}
```
## Guide
### Step 1
To get started you will have to install the npm module:
```console
$ npm install instance-decorators
```
and import it into your script:
```TypeScript
const { Instance } = require("instance-decorators")
```
### Step 2
You have to first decide what you want your decorator to decorate and depending on your decision you will put 2 or 3 arguements for your function.  

2 parameters: (target, name), 3 parameters: (target, name, descriptor)  

Then write your decorators by either giving it as an arguement or using it as a decorator for the method in a class.  
#### Choice 1: giving it as an arguement
```TypeScript
// this decorator will only work on properties
const decorator = Instance(function(target, name, descriptor) {
    ...
})
...
```
#### Choice 2: adding the decorator onto the decorator
```TypeScript
class SomeDecorators {
    // this decorator will only work on properties
    // (note that we are not calling Instance)
    @Instance
    decorator(target, name) {
        ...
    }
    ...
}
...
```
### Step 3
Decorate the class your decorator will be in with `@Instance` then simply use the decorator you created..
``` TypeScript
@Instance()
class SomeClass {
    @decorator
    // could also be a property depending on the decorator
    method() {
        ...
    }
}
...
```
### Step 4
After that you can create a new instance for your class like this:
```TypeScript
new SomeClass()
```
## Example: Creating an @AutoRun decorator ([finished product](#finished-product))
To try this example, you will have to install and import the library first..
### What we want it to do
We want this decorator to automatically run methods after the class is constructed. This could declutter your code from:
```TypeScript
class SomeClass {
    constructor() {
        this.method()
    }
    method() {
        console.log(`Ran method!`)
    }
}
```
to..
```TypeScript
class SomeClass {
    @AutoRun()
    method() {
        console.log(`Ran method!`)
    }
}
```
### Creating the decorator factory
In this decorator, we want it to accept a list of parameters to give to the function so we will have to create a factory.
```TypeScript
// This factory accepts any parameter to pass on to the method
function AutoRun(...parameters: any[]) {
    return Instance(function(target: any, name: string, descriptor: PropertyDescriptor) {

    })
}
```
### Adding code for the decorator
So after that, we will have to add some code to run the function with the passed parameters with `method.apply(target, parameters)`
```TypeScript
function(target: any, name: string, descriptor: PropertyDescriptor) {
    // we binded target to the method to ensure that it runs with the class's 'this'
    target[name].apply(target, parameters)
}
```
### Using the decorator
Then we can use it in any class that has the `@Instance()` decorator
```TypeScript
@Instance()
class SomeClass {
    @AutoRun("some text")
    method(someText: string) {
        console.log(`Ran method!\nsomeText: '${someText}'`)
        // - console.log Output:
        // Ran method!
        // someText: 'some text'
    }
}
// Construct the class
new SomeClass()
```
### Finished product
```TypeScript
const { Instance } = require("instance-decorators")

// This factory accepts any parameter to pass on to the method
function AutoRun(...parameters: any[]) {
    return Instance(function(target: any, name: string, descriptor: PropertyDescriptor) {
        // we binded target to the method to ensure that it runs with the class's 'this'
        target[name].apply(target, parameters)
    })
}

// Using it
@Instance()
class SomeClass {
    @AutoRun("some text")
    method(someText: string) {
        console.log(`Ran method!\nsomeText: '${someText}'`)
        // - console.log Output:
        // Ran method!
        // someText: 'some text'
    }
}

// Construct the class
// (Try not constructing the class and see what happens..)
new SomeClass()
```
# Documentation
## @Instance(): ((target: any) => any)
This returns a decorator that modifies the class in order for instance decorators to work
### Example
```TypeScript
@Instance()
class SomeClass {
    ...
}
...
```
## Instance(action: InstanceAction): InstanceDecorator
This creates an instance decorator with the given function.  
### Example
```TypeScript
// it has to have 2 or 3 arguments depending on the type of decorator (properties or methods)
const decorator = Instance(function(target, name) { // and optionally a descriptor
    ...
})
```
## @Instance
This is mostly the same as the previous one. The only differences are that it replaces the original method with a decorator with a type of `typeof InstanceDecorator` and the decorator will be used like `@SomeClass.decorator` instead of `@decorator`.
### Example
```TypeScript
class SomeClass {
    @Instance
    // it has to have 2 or 3 arguments depending on the type of decorator (properties or methods)
    static decorator(target, name) { // and optionally a descriptor
        ...
    }
}
```
## Imports
The `Instance` function and the type `InstanceDecorator` are exported and can be acessed like this:
```TypeScript
// You need to use 'typeof InstanceDecorator' instead of just 'InstanceDecorator'
const { Instance, InstanceDecorator } = require("instance-decorators")
```
