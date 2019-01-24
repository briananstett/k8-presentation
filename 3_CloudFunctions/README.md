# Serverless
Puriest form of mircoservices. No servers to manage, just code.

## Setup Cloud Functions
1. GCP -> Cloud Functions
2. Create Function
3. Paste in the code from `index.js`
4. Deploy

We can then test our function either with a tool like `Postman` or CURL

Make sure your body has the following payload

```
{
  "name": "<Your name>"
}
```

* Postman: POST to your http endpoint with the above endpoint
* CURL

```
$ curl <your http endpoint> -H "Content -Type:application/json"  -d '{"name":"Jane"}'
```