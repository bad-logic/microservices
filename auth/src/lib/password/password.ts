
import {scrypt,randomBytes} from 'crypto';
import {promisify} from 'util';

const pscrypt = promisify(scrypt); // converting callback based scrypt to promise based

export class Password{
    constructor(private password:string){}
    async encrypt():Promise<string>{
        const salt = randomBytes(8).toString('hex');
        const buff = (await pscrypt(this.password,salt,64)) as Buffer; // telling ts result from pscrypt is of type buffer
        return salt+":"+ buff.toString('hex');
    }
    async compare(hash:string):Promise<boolean>{
        const [salt,hashedPassword] = hash.split(':');
        const buff = (await pscrypt(this.password,salt,64)) as Buffer;
        return (hashedPassword === buff.toString('hex'));
    }
}