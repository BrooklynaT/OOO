'use strict';

module.exports = app => {
    class UserController extends app.Controller {
        // 注册
        * signin(ctx) {
            // TODO: 查询是否有重复邮箱 数据库存储邮箱密码
            let result = {};
            const name = ctx.request.body.name;
            const email = ctx.request.body.email;
            const password = ctx.request.body.password;
            if (!name || !email || !password || name.length === 0 || email.length === 0 || password.length < 6) {
                result = { success: false, message: '信息格式有误' };
                ctx.body = result;
                ctx.status = 200;
                return;
            }
            const dbResult = yield ctx.service.user.find(email);
            if (dbResult.length !== 0) {
                result = { success: false, message: '邮箱已存在' };
            } else {
                yield this.app.mysql.insert('user', { name, password, email });
                result = { success: true, message: '注册新用户成功' };
            }
            ctx.body = result;
            ctx.status = 200;
        }
        // 测试跨域
        * cors(ctx) {
            ctx.body = '跨用成功';
            ctx.status = 200;
        }
        // 登录
        * login(ctx) {
            let result = {};
            const email = ctx.request.body.email;
            const dbResult = yield ctx.service.user.find(email);
            console.log(ctx.request.body);
            if (dbResult.length === 0) {
                result = { success: false, message: '用户不存在' };
            } else if (dbResult[0].password === ctx.request.body.password) {
                result = { success: true, message: '登录成功', id: dbResult[0].id, name: dbResult[0].name };
            } else {
                result = { success: false, message: '密码错误' };
            }
            ctx.body = result;
            ctx.status = 200;
        }
    }
    return UserController;
};
