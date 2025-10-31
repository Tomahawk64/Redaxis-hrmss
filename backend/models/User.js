import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [
      function() {
        return this.isNew; // Only required for new documents
      },
      'Password is required'
    ],
    select: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    default: 'employee',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  position: {
    type: String,
  },
  phone: {
    type: String,
  },
  panCard: {
    type: String,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN card number (e.g., ABCDE1234F)']
  },
  aadharCard: {
    type: String,
    trim: true,
    match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number']
  },
  dateOfBirth: {
    type: Date,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  profileImage: {
    type: String,
    default: '/assets/client.jpg',
  },
  salary: {
    basic: Number,
    allowances: Number,
    deductions: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // === REPORTING MANAGER HIERARCHY FIELDS ===
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for top-level (Admin/CEO)
  },
  managementLevel: {
    type: Number,
    enum: [0, 1, 2, 3], // 0=Employee, 1=RM(L1), 2=Senior Manager(L2), 3=Admin/CEO(L3)
    default: 0,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }], // Auto-populated: employees reporting to this person
  canApproveLeaves: {
    type: Boolean,
    default: false, // true for L1, L2, L3
  },
  canManageAttendance: {
    type: Boolean,
    default: false, // true for L1, L2, L3
  },
  // === WORK SCHEDULE ===
  saturdayWorking: {
    type: Boolean,
    default: false, // false = Saturday off, true = Saturday working
  },
  // === ASSETS ALLOCATED ===
  assets: [{
    name: {
      type: String,
      required: true,
    },
    allocatedDate: {
      type: Date,
      default: Date.now,
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'revoked'],
      default: 'active',
    },
    revokedDate: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Auto-update teamMembers when reportingManager is assigned
userSchema.post('save', async function(doc) {
  if (doc.reportingManager) {
    // Add this user to their manager's teamMembers
    await User.findByIdAndUpdate(
      doc.reportingManager,
      { $addToSet: { teamMembers: doc._id } }
    );
  }
});

// Remove from teamMembers when reportingManager is changed
userSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  if (update.reportingManager || update.$set?.reportingManager) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate && docToUpdate.reportingManager) {
      // Remove from old manager's team
      await User.findByIdAndUpdate(
        docToUpdate.reportingManager,
        { $pull: { teamMembers: docToUpdate._id } }
      );
    }
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
