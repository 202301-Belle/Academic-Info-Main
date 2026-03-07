# 导师数据采集模板 (Crawler Data Template)

此模板定义了爬虫应当采集并存储到 MongoDB 中的数据结构。

## 1. 核心集合 (Collections)

系统主要使用以下集合存储导师数据：
- `tutors`: 导师基本信息
- `tutor_details`: 导师详细扩展信息 (包含大文本和复杂列表)
- `papers`: 论文数据
- `projects`: 项目数据

---

## 2. 数据结构详解

### 2.1 导师基本信息 (Collection: `tutors`)

```json
{
  "id": "String (Unique ID, e.g., 'tutor_12345')",
  "name": "String (姓名)",
  "school_name": "String (学校名称)",
  "department_name": "String (院系名称)",
  "title": "String (职称, e.g., '教授')",
  "research_direction": "String (研究方向)",
  "email": "String (邮箱)",
  "phone": "String (电话)",
  "avatar_url": "String (头像URL)",
  "personal_page_url": "String (个人主页URL)",
  "tags": ["String (标签列表, e.g., '985博导', '院士')"],
  "recruitment_type": "String (招生类型: 'academic', 'professional', 'both')",
  "has_funding": "Boolean (是否有科研经费)",
  "created_at": "Date",
  "updated_at": "Date"
}
```

### 2.2 导师详细信息 (Collection: `tutor_details`)

**注意：** 此集合通过 `tutor_id` 与 `tutors` 集合关联。

```json
{
  "tutor_id": "String (关联 tutors.id)",
  "bio": "String (个人简介全文)",
  
  // Tab 2: 成长脉络 (Growth Path)
  "growth_path": [
    {
      "year": "String (年份/时间段, e.g., '2020-至今')",
      "content": "String (内容, e.g., '清华大学计算机系教授')",
      "type": "String (类型, e.g., '工作经历', '教育经历', '荣誉')"
    }
  ],

  // Tab 3: 学术成果 (Achievements)
  "achievements_summary": "String (学术成果总结文本)",
  
  // Tab 1: 社会关系 (Social Relations)
  "service_summary": "String (社会服务/兼职总结文本)",
  "socials": [
    {
      "role": "String (角色, e.g., '副理事长')",
      "org": "String (组织/机构, e.g., '中国人工智能学会')"
    }
  ],

  // Tab 5: 学生培养 (Student Cultivation)
  "guidance_summary": "String (学生指导情况总结文本)",
  "students": [
    {
      "name": "String (学生姓名)",
      "year": "String (年级/毕业年份)",
      "dest": "String (去向/就业单位)"
    }
  ],

  // Tab 4: 合作资源 (Cooperation)
  "coops": [
    {
      "name": "String (合作机构/个人名称)",
      "type": "String (类型, e.g., '企业合作', '学术合作')",
      "desc": "String (合作描述)"
    }
  ],

  // Tab 7: 风险排查 (Risk Assessment)
  "risks": [
    {
      "type": "String (风险类型, e.g., '低风险', '预警')",
      "content": "String (风险描述)"
    }
  ]
}
```

### 2.3 论文数据 (Collection: `papers`)

```json
{
  "id": "String (Unique ID)",
  "tutor_id": "String (关联 tutors.id)",
  "title": "String (论文标题)",
  "authors": ["String (作者列表)"],
  "journal": "String (期刊/会议名称)",
  "year": "Integer (发表年份)",
  "doi": "String (DOI)",
  "url": "String (论文链接)",
  "citations": "Integer (引用次数)",
  "abstract": "String (摘要)"
}
```

### 2.4 项目数据 (Collection: `projects`)

```json
{
  "id": "String (Unique ID)",
  "tutor_id": "String (关联 tutors.id)",
  "title": "String (项目标题)",
  "role": "String (担任角色, e.g., '负责人')",
  "funding": "String (资助来源, e.g., '国家自然科学基金')",
  "start_date": "Date/String (开始时间)",
  "end_date": "Date/String (结束时间)",
  "amount": "Number (项目金额)",
  "status": "String (状态: 'ongoing', 'completed')",
  "description": "String (项目描述)"
}
```

## 3. 数据更新策略

1.  **增量更新**: 爬虫应首先检查 `tutors` 集合中是否存在该导师（通过 `id` 或 `personal_page_url`）。
2.  **全量覆盖**: 对于 `tutor_details` 中的列表数据（如 `growth_path`, `socials`），建议采用全量覆盖策略，即每次爬取最新数据后，替换旧的列表。
3.  **关联一致性**: 确保所有子表数据（`tutor_details`, `papers`, `projects`）的 `tutor_id` 字段准确对应 `tutors` 表中的 `id`。
