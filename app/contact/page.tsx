"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import emailjs from "@emailjs/browser";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSending(true);
    setSendResult(null);

    try {
      // 環境変数からEmailJSの設定を取得
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      // 環境変数が設定されているか確認
      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJSの設定が不足しています。環境変数を確認してください。"
        );
      }

      // EmailJSを使用してメール送信
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      if (result.status === 200) {
        // 送信成功
        setSendResult({
          success: true,
          message: "お問い合わせを送信しました。ありがとうございます。",
        });

        // フォームをリセット
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        // 送信失敗
        setSendResult({
          success: false,
          message:
            "送信に失敗しました。しばらく経ってからもう一度お試しください。",
        });
      }
    } catch (error) {
      console.error("メール送信エラー:", error);
      setSendResult({
        success: false,
        message:
          "送信中にエラーが発生しました。しばらく経ってからもう一度お試しください。",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">お問い合わせ</h1>

        {sendResult && (
          <div
            className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
              sendResult.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {sendResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p>{sendResult.message}</p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block font-medium">
              お問い合わせ内容
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="px-8 py-2 flex items-center gap-2"
              disabled={isSending}
            >
              {isSending ? "送信中..." : "送信する"}
              {sendResult?.success && <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
