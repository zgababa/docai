# createUser

## Description

```javascript
const createUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User created!'
    })
  }
}

module.exports.handler = createUser
```
