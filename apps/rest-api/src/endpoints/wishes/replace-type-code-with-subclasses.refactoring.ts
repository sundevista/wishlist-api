//// Before refactoring
enum UserType {
  Regular = 'regular',
  VIP = 'vip',
  Admin = 'admin',
}

class GeneralUser {
  type: UserType;

  constructor(type: UserType = UserType.Regular) {
    this.type = type;
  }

  unregisteredAction(): void {
    console.log('anyone can perform it');
  }

  commonAction(): void {
    if ([UserType.Regular, UserType.VIP, UserType.Admin].includes(this.type)) {
      console.log('action performed');
    }
    console.log('you cannot do it!');
  }

  premiumAction(): void {
    if ([UserType.VIP, UserType.Admin].includes(this.type)) {
      console.log('action performed');
    }
    console.log('you cannot do it!');
  }

  adminAction(): void {
    if ([UserType.Admin].includes(this.type)) {
      console.log('action performed');
    }
    console.log('you cannot do it!');
  }
}

// Usage
const user1 = new GeneralUser(UserType.Regular);
user1.adminAction();
user1.commonAction();

//// After refactoring
function createUser(type: UserType): any {
  switch (type) {
    case UserType.Regular:
      return new RegularUser();
    case UserType.VIP:
      return new VipUser();
    case UserType.Admin:
      return new AdminUser();
    default:
      return new User();
  }
}

class User {
  unregisteredAction(): void {
    console.log('anyone can perform it');
  }
}

class RegularUser extends User {
  commonAction(): void {
    console.log('action performed');
  }
}

class VipUser extends RegularUser {
  premiumAction(): void {
    console.log('action performed');
  }
}

class AdminUser extends VipUser {
  adminAction(): void {
    console.log('action performed');
  }
}

// Usage
const user2 = createUser(UserType.Regular);
user2.unregisteredAction();
user2.commonAction();
