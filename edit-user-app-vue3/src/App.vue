<template>
  <div class="edit-user-app">
    <div class="header">
      <h1>{{ isCreating ? t('editUser.createTitle') : t('editUser.title') }}</h1>
      <!-- <button @click="goBack" class="btn-back">
        ← {{ t('common.back') }}
      </button> -->
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="isPostSaveState()" class="success-message">
      <h3>User saved successfully!</h3>
      <p>You have been redirected back to the users list.</p>
      <button @click="goBack" class="btn-back">
        ← {{ t('common.back') }}
      </button>
    </div>

    <div v-else-if="showForm" class="form-container">
      <form @submit.prevent="handleSubmit" class="user-form">
        <div class="form-group">
          <label for="name">{{ t('editUser.form.name') }} *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="{ 'error': errors.name }"
            :placeholder="t('editUser.form.name')"
            required
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">{{ t('editUser.form.email') }} *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ 'error': errors.email }"
            :placeholder="t('editUser.form.email')"
            required
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="role">{{ t('editUser.form.role') }} *</label>
          <select
            id="role"
            v-model="form.role"
            :class="{ 'error': errors.role }"
            required
          >
            <option value="">{{ t('editUser.form.role') }}</option>
            <option value="user">{{ t('users.roles.user') }}</option>
            <option value="admin">{{ t('users.roles.admin') }}</option>
          </select>
          <span v-if="errors.role" class="error-text">{{ errors.role }}</span>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-cancel">
            {{ t('editUser.form.cancel') }}
          </button>
          <button type="submit" :disabled="submitting" class="btn-submit">
            <span v-if="submitting">🔄</span>
            <span v-else>{{ isCreating ? t('editUser.form.create') : t('editUser.form.submit') }}</span>
          </button>
        </div>
      </form>
    </div>

    <div v-if="user" class="user-info">
      <h3>Current User Information</h3>
      <div class="user-details">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ t(`users.roles.${user.role}`) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface FormData {
  name: string
  email: string
  role: string
}

interface FormErrors {
  name?: string
  email?: string
  role?: string
}

export default defineComponent({
  name: 'EditUserApp',
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
    const loading = ref(false)
    const error = ref('')
    const submitting = ref(false)
    const user = ref<User | null>(null)

    const form = reactive<FormData>({
      name: '',
      email: '',
      role: ''
    })

    const errors = reactive<FormErrors>({})

    const isCreating = computed(() => !user.value)
    const showForm = computed(() => !loading.value && !isPostSaveState() && (user.value || isCreating.value))

    const store = props.store
    const t = (key: string) => (props.i18n && props.i18n.t ? props.i18n.t(key) : key)

    function getUserIdFromUrl(): number | null {
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id')
      return id ? parseInt(id) : null
    }

    function isPostSaveState(): boolean {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('saved') === 'true'
    }

    // In loadUser, always clear loading if user is found
    const loadUser = async (userId: number) => {
      loading.value = true
      error.value = ''
      
      try {
        // Find user in store
        const foundUser = store.users.find((u: User) => u.id === userId)
        if (foundUser) {
          user.value = foundUser
          form.name = foundUser.name
          form.email = foundUser.email
          form.role = foundUser.role
          loading.value = false // Ensure loading is cleared here too
        } else {
          error.value = 'User not found'
        }
      } catch (err) {
        error.value = 'Failed to load user'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    // Listen for messages from parent iframe
    onMounted(() => {
      // Set initial loading state
      const userId = getUserIdFromUrl()
      if (userId) {
        loading.value = true
      }
    })

    // Watch for store changes to load user when data becomes available
    watch(() => store.users, (newUsers) => {
      const userId = getUserIdFromUrl()
      
      if (userId && newUsers.length > 0 && !user.value) {
        loadUser(userId)
      }
      // Failsafe: if user is present, clear loading
      if (user.value) {
        loading.value = false
      }
    }, { immediate: true })

    // Also watch for loading state to clear it when user is loaded
    watch(() => user.value, (newUser) => {
      if (newUser) {
        loading.value = false
      }
    }, { immediate: true })

    const validateForm = (): boolean => {
      errors.name = ''
      errors.email = ''
      errors.role = ''

      if (!form.name.trim()) {
        errors.name = t('editUser.validation.nameRequired') || 'Name is required'
      }

      if (!form.email.trim()) {
        errors.email = t('editUser.validation.emailRequired') || 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = t('editUser.validation.emailInvalid') || 'Please enter a valid email address'
      }

      if (!form.role) {
        errors.role = t('editUser.validation.roleRequired') || 'Role is required'
      }

      return !errors.name && !errors.email && !errors.role
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      submitting.value = true
      error.value = ''

      try {
        if (isCreating.value) {
          // Create new user
          if (window.parent !== window) {
            // In iframe, send message to parent
            window.parent.postMessage({
              type: 'CREATE_USER',
              userData: {
                name: form.name.trim(),
                email: form.email.trim(),
                role: form.role
              }
            }, '*')
            // Navigate back to users list after a short delay to ensure message is processed
            setTimeout(() => {
              window.parent.postMessage({ type: 'NAVIGATE', route: '/users?saved=true' }, '*')
            }, 100)
          }
        } else {
          // Update existing user
          if (window.parent !== window) {
            // In iframe, send message to parent
            window.parent.postMessage({
              type: 'UPDATE_USER',
              userId: user.value!.id,
              userData: {
                name: form.name.trim(),
                email: form.email.trim(),
                role: form.role
              }
            }, '*')
            // Navigate back to users list after a short delay to ensure message is processed
            setTimeout(() => {
              window.parent.postMessage({ type: 'NAVIGATE', route: '/users?saved=true' }, '*')
            }, 100)
          }
        }
      } catch (err) {
        error.value = 'Failed to save user'
        console.error(err)
      } finally {
        submitting.value = false
      }
    }

    const goBack = () => {
      if (window.parent !== window) {
        // In iframe, send message to parent to navigate
        window.parent.postMessage({ type: 'NAVIGATE', route: '/users' }, '*')
      }
    }

    return {
      loading,
      error,
      submitting,
      user,
      form,
      errors,
      isCreating,
      showForm,
      store,
      t,
      getUserIdFromUrl,
      isPostSaveState,
      handleSubmit,
      goBack
    }
  }
})
</script>

<style scoped>
.edit-user-app {
  padding: 20px;
  max-width: 800px;
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

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-back:hover {
  background: #5a6268;
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

.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #495057;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-submit {
  background: #28a745;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #218838;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.user-info h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.user-details {
  display: grid;
  gap: 10px;
}

.user-details p {
  margin: 0;
  color: #495057;
}

.user-details strong {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style> 