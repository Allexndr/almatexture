window.AdminHelper = {
  authenticate: function(email, password) {
    // Simple password verification
    const config = window.AdminConfig;
    if (!config || !config.enabled) {
      return { success: false, message: 'Admin panel is disabled' };
    }

    const hashedPassword = this.hashPassword(password);
    
    if (email === config.credentials.email && hashedPassword === config.credentials.passwordHash) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_last_login', new Date().toISOString());
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  },
  
  hashPassword: function(password) {
    // Simple hashing for client-side (this is not secure, just for demo)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex string and add admin config password hash
    const hexHash = Math.abs(hash).toString(16);
    return window.AdminConfig.credentials.passwordHash.substring(0, 10) + hexHash;
  }
};

// Make AdminConfig available globally
window.AdminConfig = {
  "enabled": true,
  "credentials": {
    "email": "admin@texturesalmaty.kz",
    "passwordHash": "03400c7934e19bb12001bdad7873f202591e76fa14b2b828824086b212dba2be"
  },
  "loginAttempts": {
    "max": 5,
    "lockoutTime": 30
  }
};

function createAdminUser(email, password) {
  const adminUsers = readAdminData();
  if (adminUsers.find(u => u.email === email)) {
    // ... existing code ...
  }
}

// Example usage (usually called from a script like create-admin.js)
// createAdminUser('admin@almatexture.kz', 'yourSecurePassword');

module.exports = { readAdminData, writeAdminData, createAdminUser };
