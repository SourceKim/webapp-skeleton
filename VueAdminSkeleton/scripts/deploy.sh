#!/bin/bash
set -e

# 获取部署路径：优先使用命令行参数，其次使用环境变量
DEPLOY_PATH="${1:-${DEPLOY_PATH}}"

# 检查部署路径是否提供
if [ -z "${DEPLOY_PATH}" ]; then
    echo "❌ 错误: 未指定部署路径"
    echo ""
    echo "使用方法:"
    echo "  1. 命令行参数: yarn deploy /path/to/deploy"
    echo "  2. 环境变量: DEPLOY_PATH=/path/to/deploy yarn deploy"
    echo ""
    exit 1
fi

echo "📦 检查并安装依赖..."
if [ ! -d "node_modules" ]; then
    echo "未找到 node_modules，开始安装依赖..."
    yarn install
else
    echo "依赖已存在，跳过安装"
fi

echo "🚀 开始构建项目..."
yarn build

echo "📦 开始部署到: ${DEPLOY_PATH}"

# 检查是否需要 sudo
if [ -w "${DEPLOY_PATH}" ]; then
    rsync -av --delete dist/ "${DEPLOY_PATH}/"
else
    echo "需要管理员权限，使用 sudo..."
    sudo rsync -av --chown=www-data:www-data --delete dist/ "${DEPLOY_PATH}/"
fi

echo "✅ 部署完成！"