import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          使用条款
        </h1>

        <div className="text-sm text-gray-500 mb-8 text-center">
          生效日期：10 May 2025
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              应用名称：数字能量分析 - 风水号码
            </h2>
            <p className="text-gray-700">
              欢迎使用《数字能量分析 -
              风水号码》（以下简称"本应用"）。在您下载、访问或使用本应用之前，请仔细阅读以下使用条款（以下简称"本条款"）。通过访问或使用本应用，即表示您已阅读、理解并同意遵守本条款。如您不同意本条款，请勿使用本应用。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              一、应用使用说明
            </h2>
            <p className="text-gray-700">
              本应用旨在提供基于数字能量与风水号码分析的资讯和娱乐内容。本应用不构成专业意见或财务建议，用户应自行判断其参考价值。
            </p>
            <p className="text-gray-700 mt-4">
              使用本应用需年满18岁，或获得家长或法定监护人许可。您同意仅在合法范围内使用本应用，并遵守本条款中的相关规定。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              二、订阅与支付
            </h2>
            <p className="text-gray-700">
              本应用可能提供自动续订订阅服务，相关条款如下：
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-700">
              <li>订阅时长和价格将在购买前明确展示；</li>
              <li>
                如提供免费试用，试用期结束后系统将自动从您的 Apple ID
                扣费，除非您在试用结束前至少24小时取消；
              </li>
              <li>
                订阅将自动续订，除非您在当前订阅期结束前24小时关闭自动续订功能；
              </li>
              <li>您可随时在 Apple ID 设置中管理或取消订阅。</li>
            </ul>
            <p className="text-gray-700 mt-4">
              对于订阅期间未使用的部分，我们不提供退款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              三、知识产权声明
            </h2>
            <p className="text-gray-700">
              本应用中的所有内容、设计、品牌、算法及代码均归开发者所有，受相关法律保护。用户不得擅自复制、修改、传播或制作任何衍生作品。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              四、隐私政策
            </h2>
            <p className="text-gray-700">
              本应用将遵守《隐私政策》（
              <a
                href="/number-energy-converter-privacy-policy"
                className="text-blue-600 hover:text-blue-800"
              >
                隐私政策
              </a>
              ），说明我们如何收集、使用与保护您的数据。使用本应用即表示您同意我们的隐私政策。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              五、免责声明及责任限制
            </h2>
            <p className="text-gray-700">
              本应用按"原样"提供，不保证其内容的准确性、完整性或适用性。使用本应用所产生的任何风险由您自行承担。
            </p>
            <p className="text-gray-700 mt-4">
              我们不对因使用或无法使用本应用所引起的任何间接、附带或后续损失负责。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              六、条款更新
            </h2>
            <p className="text-gray-700">
              我们有权随时更新本条款。重大更改将在本应用或网站中予以通知。继续使用即视为您接受更新后的条款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              七、终止服务
            </h2>
            <p className="text-gray-700">
              如您违反本条款，我们有权无需提前通知即暂停或终止您对本应用的使用。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              八、联系我们
            </h2>
            <p className="text-gray-700">
              如您对本条款有任何疑问，请通过以下方式与我们联系：
              <br />
              📧{" "}
              <a
                href="mailto:scott@bolt-interactive.com"
                className="text-blue-600 hover:text-blue-800"
              >
                scott@bolt-interactive.com
              </a>
            </p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-700">
              通过使用数字能量分析 -
              风水号码，您确认已阅读并同意本使用条款的所有内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
