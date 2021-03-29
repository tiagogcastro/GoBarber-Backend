export default interface IHashProvider {
  genareteHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}