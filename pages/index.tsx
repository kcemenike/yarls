import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Alert, Button, Form, Layout, Input } from 'antd';
import { useState } from 'react';
const { Header, Footer, Content } = Layout;

export default function Home() {
  const [status, setStatus] = useState<
    'info' | 'success' | 'error' | 'warning'
  >('info');
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();

  type FormValues = {
    link: string;
  };

  type ShortLinkResponse = {
    short_link: string;
  };

  type ShortLinkError = {
    error: string;
    error_description: string;
  };

  const onFinishSuccess = async ({ link }: FormValues) => {
    try {
      const res = await axios.post<ShortLinkResponse>('/api/shortener', {
        link,
      });
      setStatus('success');
      setMessage(res.data.short_link);
    } catch (e) {
      const error = e as AxiosError<ShortLinkError>;
      setStatus('error');
      setMessage(
        error.response.data.error_description || 'Something went wrong'
      );
    }
  };

  const onFinishFail = () => {
    setStatus('error');
    const error = form.getFieldError('link').join('\n');
    setMessage(error);
  };
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo} />
      </Header>
      <Content className={styles.main}>
        <div>
          <Form
            form={form}
            name="shortener"
            layout="inline"
            onFinishFailed={onFinishFail}
            onFinish={onFinishSuccess}
          >
            <Form.Item
              name="link"
              rules={[
                {
                  required: true,
                  message: 'Please input a valid URL!',
                  type: 'url',
                },
              ]}
            >
              <Input placeholder="http://enteryourlink.here" />
            </Form.Item>
            {['error', 'success'].includes(status) && (
              <Alert showIcon message={message} type={status} />
            )}
            <Form.Item shouldUpdate>
              {() => (
                <Button type="primary" htmlType="submit">
                  Shorten!
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Footer className={styles.footer}>Yet another link shortener</Footer>
    </Layout>
  );
}
