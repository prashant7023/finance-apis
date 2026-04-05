# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**usersControllerAssignRole**](#userscontrollerassignrole) | **PATCH** /api/v1/users/{id}/role | |
|[**usersControllerFindAll**](#userscontrollerfindall) | **GET** /api/v1/users | |
|[**usersControllerFindOne**](#userscontrollerfindone) | **GET** /api/v1/users/{id} | |
|[**usersControllerRemove**](#userscontrollerremove) | **DELETE** /api/v1/users/{id} | |
|[**usersControllerToggleStatus**](#userscontrollertogglestatus) | **PATCH** /api/v1/users/{id}/status | |
|[**usersControllerUpdate**](#userscontrollerupdate) | **PATCH** /api/v1/users/{id} | |

# **usersControllerAssignRole**
> usersControllerAssignRole(assignRoleDto)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    AssignRoleDto
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)
let assignRoleDto: AssignRoleDto; //

const { status, data } = await apiInstance.usersControllerAssignRole(
    id,
    assignRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignRoleDto** | **AssignRoleDto**|  | |
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

# **usersControllerFindAll**
> usersControllerFindAll()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let role: 'VIEWER' | 'ANALYST' | 'ADMIN'; // (optional) (default to undefined)
let status: 'ACTIVE' | 'INACTIVE'; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let page: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.usersControllerFindAll(
    role,
    status,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **role** | [**&#39;VIEWER&#39; | &#39;ANALYST&#39; | &#39;ADMIN&#39;**]**Array<&#39;VIEWER&#39; &#124; &#39;ANALYST&#39; &#124; &#39;ADMIN&#39;>** |  | (optional) defaults to undefined|
| **status** | [**&#39;ACTIVE&#39; | &#39;INACTIVE&#39;**]**Array<&#39;ACTIVE&#39; &#124; &#39;INACTIVE&#39;>** |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|


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

# **usersControllerFindOne**
> usersControllerFindOne()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.usersControllerFindOne(
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

# **usersControllerRemove**
> usersControllerRemove()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.usersControllerRemove(
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

# **usersControllerToggleStatus**
> usersControllerToggleStatus()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.usersControllerToggleStatus(
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

# **usersControllerUpdate**
> usersControllerUpdate(updateUserDto)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserDto
} from 'client';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; // (default to undefined)
let updateUserDto: UpdateUserDto; //

const { status, data } = await apiInstance.usersControllerUpdate(
    id,
    updateUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |
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

