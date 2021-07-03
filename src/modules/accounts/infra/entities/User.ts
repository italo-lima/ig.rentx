import { v4 as uuidV4 } from "uuid"
import { Column, Entity, PrimaryColumn } from "typeorm"
import { Exclude, Expose } from "class-transformer";

@Entity('users')
class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  @Column()
  driver_license: string;

  @Column()
  // @Exclude()
  isAdmin: boolean;

  @Column()
  avatar: string;

  @Column()
  created_at: Date;

  @Expose({ name: "avatar_url" })
  avatar_url(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (process.env.disk) {
      case 'local':
        return `${process.env.APP_API_URL}/avatar/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { User }