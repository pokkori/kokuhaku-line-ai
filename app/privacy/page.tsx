import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8 text-slate-300 text-sm leading-relaxed">
        <Link href="/" className="text-blue-400 text-sm hover:text-blue-300 block">← トップに戻る</Link>
        <h1 className="text-2xl font-bold text-white">プライバシーポリシー</h1>
        <section>
          <h2 className="text-white font-bold mb-2">収集する情報</h2>
          <p>本サービスでは、入力いただいたLINEのメッセージ内容、決済情報（PAY.JP（PAY.JP株式会社）が管理）、およびCookieによる利用状況を収集します。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">情報の利用目的</h2>
          <p>収集した情報は、AI分析サービスの提供、サービス改善、および不正利用の防止のためにのみ使用します。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">第三者への提供</h2>
          <p>法令に基づく場合を除き、お客様の個人情報を第三者に提供することはありません。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">入力内容の取り扱い</h2>
          <p>入力いただいたLINEのメッセージは、AI分析のためにAnthropicのAPIに送信されます。個人を特定できる形での保存・利用はしません。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">第三者のメッセージ入力について</h2>
          <p>本サービスでは、他の方から受け取ったLINEのメッセージを入力いただく場合があります。入力内容はAI分析のみに使用し、第三者への提供・保存は行いません。入力されたメッセージに含まれる個人情報の取り扱いはお客様の責任となりますので、入力前に相手方のプライバシーへの配慮をお願いします。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">Cookieの使用</h2>
          <p>本サービスでは、無料試用回数の管理およびログイン状態の維持のためにCookieを使用しています。</p>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">外部送信規律に基づく情報送信</h2>
          <p className="mb-3">本サービスでは、電気通信事業法の外部送信規律に基づき、以下の外部サービスにデータを送信しています。</p>
          <table className="w-full text-left text-xs text-slate-400">
            <thead><tr className="border-b border-white/10"><th className="py-2 pr-2">送信先</th><th className="py-2 pr-2">目的</th><th className="py-2">送信される情報</th></tr></thead>
            <tbody>
              <tr className="border-b border-white/5"><td className="py-2 pr-2">Anthropic（Claude API）</td><td className="py-2 pr-2">AI分析・返信案の生成</td><td className="py-2">ユーザーの入力テキスト（LINEメッセージ）</td></tr>
              <tr className="border-b border-white/5"><td className="py-2 pr-2">PAY.JP（PAY株式会社）</td><td className="py-2 pr-2">決済処理</td><td className="py-2">決済に必要な情報</td></tr>
              <tr><td className="py-2 pr-2">Vercel Inc.</td><td className="py-2 pr-2">ホスティング・アクセス解析</td><td className="py-2">ページビュー・デバイス情報</td></tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-white font-bold mb-2">お問い合わせ</h2>
          <p>プライバシーに関するご質問はX(Twitter) @levona_design へのDMまでご連絡ください。</p>
        </section>
      </div>
    </main>
  );
}
