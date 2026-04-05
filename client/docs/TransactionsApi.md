# TransactionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**transactionsControllerCreate**](#transactionscontrollercreate) | **POST** /api/v1/transactions | |
|[**transactionsControllerFindAll**](#transactionscontrollerfindall) | **GET** /api/v1/transactions | |
|[**transactionsControllerFindOne**](#transactionscontrollerfindone) | **GET** /api/v1/transactions/{id} | |
|[**transactionsControllerRemove**](#transactionscontrollerremove) | **DELETE** /api/v1/transactions/{id} | |
|[**transactionsControllerUpdate**](#transactionscontrollerupdate) | **PATCH** /api/v1/transactions/{id} | |

# **transactionsControllerCreate**
> transactionsControllerCreate(createTransactionDto)


### Example

```typescript
import {
    TransactionsApi,
    Configuration,
    CreateTransactionDto
} from 'client';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let createTransactionDto: CreateTransactionDto; //

const { status, data } = await apiInstance.transactionsControllerCreate(
    createTransactionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTransactionDto** | **CreateTransactionDto**|  | |


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsControllerFindAll**
> transactionsControllerFindAll()


### Example

```typescript
import {
    TransactionsApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let date: string; // (optional) (default to undefined)
let type: 'INCOME' | 'EXPENSE'; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)
let from: string; // (optional) (default to undefined)
let to: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)
let limit: string; // (optional) (default to undefined)
let sortBy: 'date' | 'amount' | 'createdAt'; // (optional) (default to undefined)
let order: 'asc' | 'desc'; // (optional) (default to undefined)

const { status, data } = await apiInstance.transactionsControllerFindAll(
    date,
    type,
    category,
    from,
    to,
    page,
    limit,
    sortBy,
    order
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **date** | [**string**] |  | (optional) defaults to undefined|
| **type** | [**&#39;INCOME&#39; | &#39;EXPENSE&#39;**]**Array<&#39;INCOME&#39; &#124; &#39;EXPENSE&#39;>** |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|
| **from** | [**string**] |  | (optional) defaults to undefined|
| **to** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**&#39;date&#39; | &#39;amount&#39; | &#39;createdAt&#39;**]**Array<&#39;date&#39; &#124; &#39;amount&#39; &#124; &#39;createdAt&#39;>** |  | (optional) defaults to undefined|
| **order** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsControllerFindOne**
> transactionsControllerFindOne()


### Example

```typescript
import {
    TransactionsApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.transactionsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsControllerRemove**
> transactionsControllerRemove()


### Example

```typescript
import {
    TransactionsApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.transactionsControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsControllerUpdate**
> transactionsControllerUpdate(updateTransactionDto)


### Example

```typescript
import {
    TransactionsApi,
    Configuration,
    UpdateTransactionDto
} from 'client';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let id: string; // (default to undefined)
let updateTransactionDto: UpdateTransactionDto; //

const { status, data } = await apiInstance.transactionsControllerUpdate(
    id,
    updateTransactionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTransactionDto** | **UpdateTransactionDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

