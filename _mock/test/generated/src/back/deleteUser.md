# deleteUser

## Description

```javascript
const deleteUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User deleted!'
    })
  }
}

module.exports.handler = deleteUser
```
