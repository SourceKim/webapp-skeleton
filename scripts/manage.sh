#!/bin/bash
set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# 加载环境变量
if [ -f "${PROJECT_ROOT}/.env" ]; then
    set -a
    source "${PROJECT_ROOT}/.env"
    set +a
fi

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 显示使用说明
show_usage() {
    echo "使用方法: $0 <command> [project] [options]"
    echo ""
    echo "命令:"
    echo "  dev         启动开发服务器"
    echo "  deploy      部署项目"
    echo "  build       构建项目"
    echo ""
    echo "项目:"
    echo "  backend      ExpressBackendSkeleton (后端)"
    echo "  admin        VueAdminSkeleton (管理后台)"
    echo "  taro         TaroFrontendSkeleton (Taro 前端)"
    echo "  all          所有项目"
    echo ""
    echo "示例:"
    echo "  $0 dev backend              # 启动后端开发服务器"
    echo "  $0 dev admin               # 启动管理后台开发服务器"
    echo "  $0 dev taro                # 启动 Taro H5 开发服务器"
    echo "  $0 dev all                 # 启动所有项目的开发服务器"
    echo "  $0 deploy admin /path/to  # 部署管理后台"
    echo "  $0 deploy taro /path/to   # 部署 Taro H5"
    echo ""
    echo "环境变量配置 (在 .env 文件中):"
    echo "  DEPLOY_PATH_ADMIN         管理后台部署路径"
    echo "  DEPLOY_PATH_TARO         Taro H5 部署路径"
    echo ""
    exit 1
}

# 检查项目目录是否存在
check_project() {
    local project=$1
    local project_dir=""
    
    case $project in
        backend)
            project_dir="${PROJECT_ROOT}/ExpressBackendSkeleton"
            ;;
        admin)
            project_dir="${PROJECT_ROOT}/VueAdminSkeleton"
            ;;
        taro)
            project_dir="${PROJECT_ROOT}/TaroFrontendSkeleton"
            ;;
        *)
            print_error "未知项目: $project"
            return 1
            ;;
    esac
    
    if [ ! -d "$project_dir" ]; then
        print_error "项目目录不存在: $project_dir"
        return 1
    fi
    
    echo "$project_dir"
}

# 启动开发服务器
run_dev() {
    local project=$1
    local project_dir=$(check_project "$project")
    
    if [ -z "$project_dir" ]; then
        return 1
    fi
    
    print_info "启动 $project 开发服务器..."
    cd "$project_dir"
    
    case $project in
        backend)
            yarn dev
            ;;
        admin)
            yarn dev
            ;;
        taro)
            yarn dev:h5
            ;;
    esac
}

# 构建项目
run_build() {
    local project=$1
    local project_dir=$(check_project "$project")
    
    if [ -z "$project_dir" ]; then
        return 1
    fi
    
    print_info "构建 $project 项目..."
    cd "$project_dir"
    
    case $project in
        backend)
            yarn build
            ;;
        admin)
            yarn build
            ;;
        taro)
            yarn build:h5
            ;;
    esac
    
    print_success "$project 构建完成"
}

# 部署项目
run_deploy() {
    local project=$1
    local deploy_path=$2
    local project_dir=$(check_project "$project")
    
    if [ -z "$project_dir" ]; then
        return 1
    fi
    
    # 获取部署路径
    case $project in
        admin)
            deploy_path="${deploy_path:-${DEPLOY_PATH_ADMIN}}"
            ;;
        taro)
            deploy_path="${deploy_path:-${DEPLOY_PATH_TARO}}"
            ;;
        backend)
            print_error "后端项目暂不支持部署命令，请手动部署"
            return 1
            ;;
    esac
    
    if [ -z "$deploy_path" ]; then
        print_error "未指定部署路径"
        echo ""
        echo "请使用以下方式之一:"
        echo "  1. 命令行参数: $0 deploy $project /path/to/deploy"
        echo "  2. 环境变量: 在 .env 文件中设置 DEPLOY_PATH_$(echo $project | tr '[:lower:]' '[:upper:]')"
        return 1
    fi
    
    print_info "部署 $project 到: $deploy_path"
    cd "$project_dir"
    
    case $project in
        admin)
            DEPLOY_PATH="$deploy_path" yarn deploy
            ;;
        taro)
            DEPLOY_PATH="$deploy_path" yarn deploy:h5
            ;;
    esac
    
    print_success "$project 部署完成"
}

# 启动所有项目的开发服务器
run_dev_all() {
    print_info "启动所有项目的开发服务器..."
    
    # 使用后台进程启动各个项目
    run_dev backend &
    sleep 2
    
    run_dev admin &
    sleep 2
    
    run_dev taro &
    
    # 等待所有后台进程
    wait
}

# 主函数
main() {
    if [ $# -lt 1 ]; then
        show_usage
    fi
    
    local command=$1
    local project=${2:-""}
    local option=$3
    
    case $command in
        dev)
            if [ -z "$project" ]; then
                print_error "请指定项目名称"
                show_usage
            fi
            
            if [ "$project" = "all" ]; then
                run_dev_all
            else
                run_dev "$project"
            fi
            ;;
        build)
            if [ -z "$project" ]; then
                print_error "请指定项目名称"
                show_usage
            fi
            
            if [ "$project" = "all" ]; then
                run_build backend
                run_build admin
                run_build taro
            else
                run_build "$project"
            fi
            ;;
        deploy)
            if [ -z "$project" ]; then
                print_error "请指定项目名称"
                show_usage
            fi
            
            if [ "$project" = "all" ]; then
                print_warning "不支持同时部署所有项目，请分别部署"
                show_usage
            else
                run_deploy "$project" "$option"
            fi
            ;;
        *)
            print_error "未知命令: $command"
            show_usage
            ;;
    esac
}

main "$@"
