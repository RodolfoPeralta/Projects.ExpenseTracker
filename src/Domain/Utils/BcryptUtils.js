import bcrypt from 'bcrypt';

class BcryptUtils {

    static CreateHash(password) {
        try {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        }
        catch(error) {
            throw("[BcryptUtils] Error when trying to hash the password");
        }
    }

    static ComparePassword(password, hash) {
        try {
            return bcrypt.compareSync(password, hash);
        }
        catch(error) {
            throw("[BcryptUtils] Error when trying to compare password and hash");
        }
    }
}

export default BcryptUtils;