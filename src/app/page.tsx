'use client';

import { useAuth } from "@/contexts/useAuth";
import { authService, ILogin } from "@/infra/services/auth";
import { App, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Home() {
  const { login } = useAuth()
  const router = useRouter()
  const { notification } = App.useApp();

  const loginHandle = useCallback(async (values: ILogin) => {
    await authService.login(values).then(({ data: { token, user } }) => {
      login({ user, token })
      notification.success({ message: 'Login', description: 'Login realizado com sucesso' })
      router.push('/dashboard/agenda')
    }).catch((error) => {
      notification.error({ message: 'Login', description: error.response.data.message })
    })
  }, [])

  return (
    <div className="flex justify-between  h-screen">
      <img src={'/loginImage.png'} className="bg-[#A0222E] md:block hidden" />
      <div className="flex justify-center items-center flex-col flex-1">
        <img src="/messentech.png" alt="Logo" className="size-56 mb-7" />
        <div className="min-w-[400px]">
          <Form layout="vertical" onFinish={loginHandle}>
            <Form.Item
              name={'login'}
              label="E-Mail"
              rules={[{ required: true, message: 'E-mail é obrigatório' }, { type: 'email', message: 'E-mail inválido' }]}
            >
              <Input size="large" type="email" />
            </Form.Item>
            <Form.Item
              name={'password'}
              label="Senha"
              rules={[{ required: true, message: 'Senha é obrigatória' }]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Button htmlType="submit" className="w-full" type="primary" size="large" >Entrar</Button>
          </Form>
        </div>
      </div>
    </div >
  );
}
