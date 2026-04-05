## client@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install client@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AuthApi* | [**authControllerLogin**](docs/AuthApi.md#authcontrollerlogin) | **POST** /api/v1/auth/login | 
*AuthApi* | [**authControllerLogout**](docs/AuthApi.md#authcontrollerlogout) | **POST** /api/v1/auth/logout | 
*AuthApi* | [**authControllerRefresh**](docs/AuthApi.md#authcontrollerrefresh) | **POST** /api/v1/auth/refresh | 
*AuthApi* | [**authControllerRegister**](docs/AuthApi.md#authcontrollerregister) | **POST** /api/v1/auth/register | 
*DashboardApi* | [**dashboardControllerGetCategoryBreakdown**](docs/DashboardApi.md#dashboardcontrollergetcategorybreakdown) | **GET** /api/v1/dashboard/categories | 
*DashboardApi* | [**dashboardControllerGetMonthlyTrends**](docs/DashboardApi.md#dashboardcontrollergetmonthlytrends) | **GET** /api/v1/dashboard/trends | 
*DashboardApi* | [**dashboardControllerGetRecentActivity**](docs/DashboardApi.md#dashboardcontrollergetrecentactivity) | **GET** /api/v1/dashboard/recent | 
*DashboardApi* | [**dashboardControllerGetSummary**](docs/DashboardApi.md#dashboardcontrollergetsummary) | **GET** /api/v1/dashboard/summary | 
*TransactionsApi* | [**transactionsControllerCreate**](docs/TransactionsApi.md#transactionscontrollercreate) | **POST** /api/v1/transactions | 
*TransactionsApi* | [**transactionsControllerFindAll**](docs/TransactionsApi.md#transactionscontrollerfindall) | **GET** /api/v1/transactions | 
*TransactionsApi* | [**transactionsControllerFindOne**](docs/TransactionsApi.md#transactionscontrollerfindone) | **GET** /api/v1/transactions/{id} | 
*TransactionsApi* | [**transactionsControllerRemove**](docs/TransactionsApi.md#transactionscontrollerremove) | **DELETE** /api/v1/transactions/{id} | 
*TransactionsApi* | [**transactionsControllerUpdate**](docs/TransactionsApi.md#transactionscontrollerupdate) | **PATCH** /api/v1/transactions/{id} | 
*UsersApi* | [**usersControllerAssignRole**](docs/UsersApi.md#userscontrollerassignrole) | **PATCH** /api/v1/users/{id}/role | 
*UsersApi* | [**usersControllerFindAll**](docs/UsersApi.md#userscontrollerfindall) | **GET** /api/v1/users | 
*UsersApi* | [**usersControllerFindOne**](docs/UsersApi.md#userscontrollerfindone) | **GET** /api/v1/users/{id} | 
*UsersApi* | [**usersControllerRemove**](docs/UsersApi.md#userscontrollerremove) | **DELETE** /api/v1/users/{id} | 
*UsersApi* | [**usersControllerToggleStatus**](docs/UsersApi.md#userscontrollertogglestatus) | **PATCH** /api/v1/users/{id}/status | 
*UsersApi* | [**usersControllerUpdate**](docs/UsersApi.md#userscontrollerupdate) | **PATCH** /api/v1/users/{id} | 


### Documentation For Models

 - [AssignRoleDto](docs/AssignRoleDto.md)
 - [CreateTransactionDto](docs/CreateTransactionDto.md)
 - [LoginDto](docs/LoginDto.md)
 - [RegisterDto](docs/RegisterDto.md)
 - [UpdateTransactionDto](docs/UpdateTransactionDto.md)
 - [UpdateUserDto](docs/UpdateUserDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="bearer"></a>
### bearer

- **Type**: Bearer authentication (JWT)

<a id="x-user-id"></a>
### x-user-id

- **Type**: API key
- **API key parameter name**: x-user-id
- **Location**: HTTP header

