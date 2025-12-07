#!/bin/bash
set -e

echo "🚀 开始构建项目..."
yarn build

echo "📦 开始部署..."

# 检查是否需要 sudo
if [ -w "/opt/1panel/www/sites/skeleton-admin.kimsu.fun/index" ]; then
    rsync -av --delete dist/ /opt/1panel/www/sites/skeleton-admin.kimsu.fun/index/
else
    echo "需要管理员权限，使用 sudo..."
    sudo rsync -av --chown=www-data:www-data --delete dist/ /opt/1panel/www/sites/skeleton-admin.kimsu.fun/index/
fi

echo "✅ 部署完成！"