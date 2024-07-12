import { getBlogList } from '@/api';

export default function Login() {

  // const env = loadEnv(import.meta.env.mode, process.cwd(),"")

  console.log('env xx', import.meta.env);

  return (
    <div onClick={getBlogList}>登陆</div>
  )
}
