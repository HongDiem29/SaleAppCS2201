from StudentManage.models import QuyDinh, MonHoc, UserRoleEnum
from StudentManage import app, dao, db
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin import BaseView, expose, AdminIndexView
from flask_login import logout_user, current_user
from flask import redirect, request, render_template

admin = Admin(app=app, name='Quản lý học sinh', template_mode='bootstrap4')

class MySubjectView(ModelView):
    column_list = ['monHoc_id', 'tenMH']
    column_searchable_list = ['tenMH']

admin.add_view(ModelView(QuyDinh, db.session))
admin.add_view(MySubjectView(MonHoc, db.session))


class SubjectReportView(BaseView):
    @expose('/', methods=['GET', 'POST'])
    def index(self):
        from flask import request
        from StudentManage.models import MonHoc, HocKi


        subject_id = request.args.get('subject_id', type=int)
        semester_id = request.args.get('semester_id', type=int)


        subjects = MonHoc.query.all()
        semesters = HocKi.query.all()

        # Lấy dữ liệu báo cáo nếu có thông tin
        report_data = []
        if subject_id and semester_id:
            report_data = dao.get_subject_report(subject_id, semester_id)

        return self.render(
            'subject_report.html',
            subjects=subjects,
            semesters=semesters,
            report_data=report_data,
            subject_id=subject_id,
            semester_id=semester_id
        )


class AuthenticatedAdmin(BaseView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.user_role == UserRoleEnum.ADMIN

admin.add_view(SubjectReportView(name='Thống kê môn học', endpoint='baocao'))


class nguoidung(BaseView):
    def truycap(self):
        return current_user.truycap


class LogoutView(nguoidung):
    @expose("/")
    def index(self):
        logout_user()
        return redirect('/')

admin.add_view(LogoutView(name='Đăng xuất'))