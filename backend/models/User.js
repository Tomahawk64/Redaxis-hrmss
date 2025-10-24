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

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
