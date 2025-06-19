
import { UserStorageService } from './UserStorageService';

interface UserData {
  userId: string;
  password: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp: string;
}

export class UserDataService {
  private userStorage: UserStorageService;

  constructor() {
    this.userStorage = new UserStorageService();
  }

  async saveUser(userData: UserData): Promise<boolean> {
    return await this.userStorage.saveUser(userData);
  }

  async findUser(userId: string, password: string): Promise<UserData | null> {
    return await this.userStorage.findUser(userId, password);
  }

  async getAllUsers(): Promise<UserData[]> {
    return await this.userStorage.getAllUsers();
  }
}
