<template>
  <div class="users-app">
    <div class="header">
      <h1>{{ t('users.title') }}</h1>
      <button 
        v-if="showCreateButton" 
        @click="createUser" 
        class="btn-create"
        :disabled="store.loading"
      >
        {{ t('users.actions.create') }}
      </button>
    </div>

    <div v-if="store.error" class="error-message">
      {{ store.error }}
    </div>

    <div v-if="showSuccessMessage" class="success-message">
      <h3>User saved successfully!</h3>
      <p>The user has been updated in the system.</p>
    </div>

    <div v-if="showLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ t('messages.loadingUsers') }}</p>
    </div>

    <div v-else-if="showEmptyState" class="empty-state">
      <p>{{ t('messages.noUsers') }}</p>
    </div>

    <div v-else-if="showTable" class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>{{ t('users.table.name') }}</th>
            <th>{{ t('users.table.email') }}</th>
            <th>{{ t('users.table.role') }}</th>
            <th>{{ t('users.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in store.users" :key="user.id" class="user-row">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', `role-${user.role}`]">
                {{ t(`users.roles.${user.role}`) }}
              </span>
            </td>
            <td class="actions">
              <button @click="editUser(user)" class="btn-edit">
                {{ t('users.actions.edit') }}
              </button>
              <button @click="deleteUser(user.id)" class="btn-delete">
                {{ t('users.actions.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="stats">
      <p>Total Users: {{ store.users.length }}</p>
      <p>Admins: {{ adminCount }}</p>
      <p>Regular Users: {{ userCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'UsersApp',
  props: {
    store: {
      type: Object,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = props.store
    const t = (key: string) => (props.i18n && props.i18n.t ? props.i18n.t(key) : key)

    const adminCount = computed(() => 
      store.users.filter((user: any) => user.role === 'admin').length
    )
    
    const userCount = computed(() => 
      store.users.filter((user: any) => user.role === 'user').length
    )

    const showLoading = computed(() => store.loading && store.users.length === 0)
    const showEmptyState = computed(() => !store.loading && store.users.length === 0)
    const showTable = computed(() => store.users.length > 0)
    const showCreateButton = computed(() => !store.loading && !store.error)
    const showSuccessMessage = computed(() => {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('saved') === 'true'
    })

    const editUser = (user: any) => {
      // Implementation for edit user
      // Communicate with parent shell
    }

    const createUser = () => {
      // Implementation for create user
      // Communicate with parent shell
    }

    const deleteUser = (userId: number) => {
      const confirmMessage = t('messages.confirmDelete') || 'Are you sure you want to delete this user?'
      if (confirm(confirmMessage)) {
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'DELETE_USER',
            userId: userId
          }, '*')
        }
      }
    }

    // Listen for messages from parent iframe
    window.addEventListener('message', (event) => {
      if (event.data && (event.data.type === 'INIT_DATA' || event.data.type === 'STORE_UPDATE')) {
        if (event.data.store) {
          store.users = event.data.store.users || []
          store.loading = event.data.store.loading || false
          store.error = event.data.store.error || null
        }
      }
    })

    return {
      store,
      t,
      adminCount,
      userCount,
      showLoading,
      showEmptyState,
      showTable,
      showCreateButton,
      showSuccessMessage,
      editUser,
      createUser,
      deleteUser
    }
  }
})
</script>

<style scoped>
.users-app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.btn-create {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-create:hover:not(:disabled) {
  background: #218838;
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* .btn-refresh {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.btn-refresh:hover:not(:disabled) {
  background: #2980b9;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
} */

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
  text-align: center;
}

.success-message h3 {
  margin: 0 0 10px 0;
  color: #155724;
}

.success-message p {
  margin: 0 0 15px 0;
  color: #155724;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.users-table-container {
  overflow-x: auto;
  margin-bottom: 30px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.user-row:hover {
  background: #f8f9fa;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-admin {
  background: #e3f2fd;
  color: #1976d2;
}

.role-user {
  background: #f3e5f5;
  color: #7b1fa2;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;
}

.btn-edit {
  background: #28a745;
  color: white;
}

.btn-edit:hover {
  background: #218838;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

.stats {
  display: flex;
  gap: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.stats p {
  margin: 0;
  font-weight: 500;
  color: #495057;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 