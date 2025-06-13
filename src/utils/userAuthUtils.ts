
interface RegisteredUser {
  userId: string;
  password: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp?: string;
}

// Enhanced user search with detailed logging
export function findRegisteredUser(userId: string, password: string): RegisteredUser | null {
  console.log('🔍 === USER SEARCH START ===');
  console.log('🔍 Searching for userId:', userId);
  console.log('🔍 Password provided:', password ? 'Yes' : 'No');
  
  try {
    const registeredUsersData = localStorage.getItem('registered_users');
    
    if (!registeredUsersData) {
      console.log('❌ No registered_users data found in localStorage');
      return null;
    }

    const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersData);
    console.log('🔍 Total registered users found:', registeredUsers.length);
    
    if (registeredUsers.length === 0) {
      console.log('❌ No users in the registered users array');
      return null;
    }

    // Log all available userIds for comparison
    const availableUserIds = registeredUsers.map(u => u.userId);
    console.log('🔍 Available userIds:', availableUserIds);
    
    // Try exact match first
    let user = registeredUsers.find(user => {
      const userIdMatch = user.userId === userId;
      const passwordMatch = user.password === password;
      console.log(`🔍 Checking user ${user.userId}: userIdMatch=${userIdMatch}, passwordMatch=${passwordMatch}`);
      return userIdMatch && passwordMatch;
    });

    if (user) {
      console.log('✅ Found user with exact match:', {
        userId: user.userId,
        organizationName: user.organizationName,
        entityType: user.entityType,
        country: user.country
      });
      return user;
    }

    // Try case-insensitive match
    user = registeredUsers.find(user => {
      const userIdMatch = user.userId.toLowerCase() === userId.toLowerCase();
      const passwordMatch = user.password === password;
      console.log(`🔍 Checking user ${user.userId} (case-insensitive): userIdMatch=${userIdMatch}, passwordMatch=${passwordMatch}`);
      return userIdMatch && passwordMatch;
    });

    if (user) {
      console.log('✅ Found user with case-insensitive match:', {
        userId: user.userId,
        organizationName: user.organizationName
      });
      return user;
    }

    // Check if userId exists but password is wrong
    const userWithSameId = registeredUsers.find(user => 
      user.userId.toLowerCase() === userId.toLowerCase()
    );
    
    if (userWithSameId) {
      console.log('⚠️ Found user with matching ID but wrong password');
      return null;
    }

    console.log('❌ No user found with matching credentials');
    return null;

  } catch (error) {
    console.error('❌ Error during user search:', error);
    return null;
  } finally {
    console.log('🔍 === USER SEARCH END ===');
  }
}

export function checkUserExistsForBetterError(userId: string): 'user_exists' | 'no_users' | 'user_not_found' {
  const usersData = localStorage.getItem('registered_users');
  if (!usersData) {
    return 'no_users';
  }
  
  const users = JSON.parse(usersData);
  const userExists = users.find((u: any) => 
    u.userId.toLowerCase() === userId.toLowerCase()
  );
  
  return userExists ? 'user_exists' : 'user_not_found';
}
