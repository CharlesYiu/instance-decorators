# [Instance Decorators](https://www.npmjs.com/package/instance-decorators)
Note: The documentation is not written yet so you can read the guide for now.
## What does it do?
This npm library enables users to create decorators that run when the class constructs.
## Use cases
There are a huge range of applicable reasons and places where using this library benifits you (and your library/frameworks's users) including..
### 1. Using it for providing values to the user
```TypeScript
function database(name?: string): InstanceDecorator {
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
const Property = Instance(function(values: Values, name: string, descriptor: PropertyDescriptor) {
    const processor = values[name]
    let notProcessed = true
    let value = undefined
    Object.defineProperty(values, name, {
        get: function() { return value }
        set: function(newValue) {
            if (notProcessed) {
                value = processor(newValue)
                notProcessed = false
            } else value = newValue
        }
    })
})

@Instance()
class Values {
    @Property
    property(value: string): string {
        ...
    }
}
```
## Guide
### Step 1
To get started you will have to install the npm module:
```
$ npm install instance-decorators
```
and import it into your script:
```TypeScript
const { Instance } = require("instance-decorators")
```
### Step 2
Decide and place a decorator for the class where you will use the features
```TypeScript
@Instance()
class SomeClass {
    ...
}
...
```
### Step 3
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
### Step 4
All that are left to do are to create an instance for the class and see the decorators run!
```TypeScript
new SomeClass()
```
