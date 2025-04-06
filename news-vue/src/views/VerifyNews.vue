<template>
  <div class="verify-news">
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="gradient-circle circle-3"></div>
      <div class="gradient-circle circle-4"></div>
      <div class="floating-shapes">
        <div v-for="i in 12" :key="i" 
             :class="['shape', `shape-${i % 4 + 1}`]"
             :style="getRandomStyle()"
        ></div>
      </div>
      <div class="grid-overlay"></div>
    </div>

    <div class="content-container">
      <div class="login-tip">
        <el-alert
          title="提示：登录后可以保存检测历史"
          type="info"
          :closable="true"
          show-icon
        />
      </div>

      <div class="page-decoration">
        <div class="deco-circle"></div>
        <div class="deco-line"></div>
        <div class="deco-text gradient-text">AI News Verification</div>
        <div class="deco-line"></div>
        <div class="deco-circle"></div>
      </div>

      <div class="page-header">
        <div class="header-badge">
          <el-icon><data-analysis /></el-icon>
          <span>AI 驱动</span>
          <div class="badge-glow"></div>
        </div>
        <div class="header-content">
          <h1 class="text-center">新闻真实性检测</h1>
          <p class="subtitle text-center">基于人工智能的多维度新闻真实性智能分析平台</p>
          <div class="header-decoration">
            <div class="deco-line"></div>
            <div class="deco-dot"></div>
            <div class="deco-line"></div>
          </div>
        </div>
        <div class="feature-tags">
          <el-tag effect="dark" type="success" class="feature-tag">
            <el-icon><check /></el-icon>
            智能分析
            <div class="tag-glow"></div>
          </el-tag>
          <el-tag effect="dark" type="warning" class="feature-tag">
            <el-icon><warning /></el-icon>
            实时检测
            <div class="tag-glow"></div>
          </el-tag>
          <el-tag effect="dark" type="info" class="feature-tag">
            <el-icon><data-line /></el-icon>
            数据可视
            <div class="tag-glow"></div>
          </el-tag>
        </div>
      </div>

      <div class="verify-layout">
        <!-- 检测控制台 -->
        <div class="verify-main">
          <el-card class="verify-card glass-effect">
            <div class="card-decoration">
              <div class="corner-dot top-left"></div>
              <div class="corner-dot top-right"></div>
              <div class="corner-dot bottom-left"></div>
              <div class="corner-dot bottom-right"></div>
            </div>
            <div class="card-header-custom">
              <div class="header-left">
                <div class="icon-wrapper primary">
                  <el-icon><Monitor /></el-icon>
                </div>
                <span class="header-title">检测控制台</span>
              </div>
              <div class="header-right">
                <el-popover
                  placement="right"
                  :width="400"
                  trigger="click"
                  popper-class="sample-popover"
                >
                  <template #reference>
                    <el-button 
                      type="primary" 
                      link
                      class="sample-btn"
                    >
                      <el-icon><Document /></el-icon>
                      样例新闻
                    </el-button>
                  </template>
                  
                  <template #default>
                    <div class="sample-list">
                      <h4 class="sample-title">选择样例新闻</h4>
                      <div class="sample-items">
                        <div 
                          v-for="sample in newsSamples" 
                          :key="sample.id"
                          class="sample-item"
                          @click="handleSampleSelect(sample)"
                        >
                          <div class="item-header">
                            <span class="item-title">{{ sample.title }}</span>
                            <el-tag size="small" :type="getCategoryTagType(sample.category) || 'success'">
                              {{ getCategoryText(sample.category) }}
                            </el-tag>
                          </div>
                          <p class="item-content">{{ sample.content }}</p>
                          <div class="item-footer">
                            <el-button 
                              type="primary" 
                              link 
                              size="small"
                            >
                              使用此样例
                              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
            <el-tabs v-model="activeTab" class="custom-tabs">
              <el-tab-pane label="文本检测" name="text">
                <template #label>
                  <div class="tab-label">
                    <el-icon><Document /></el-icon>
                    <span>文本检测</span>
                  </div>
                </template>
                <!-- 添加检测说明区域 -->
                <div class="detection-guide">
                  <div class="guide-header">
                    <el-icon><info-filled /></el-icon>
                    <span>检测说明</span>
                  </div>
                  <div class="guide-content">
                    <p class="guide-desc">本系统支持对新闻文本进行多维度真实性分析，包括：</p>
                    <ul class="feature-list">
                      <li>
                        <el-icon><warning /></el-icon>
                        <span>内容真实性评估</span>
                      </li>
                      <li>
                        <el-icon><connection /></el-icon>
                        <span>来源可靠性验证</span>
                      </li>
                      <li>
                        <el-icon><data-line /></el-icon>
                        <span>情感倾向分析</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <el-form ref="formRef" :model="form" :rules="rules">
                  <el-form-item prop="title">
                    <el-input 
                      v-model="form.title"
                      placeholder="请输入新闻标题"
                    />
                  </el-form-item>
                  
                  <el-form-item prop="content">
                    <el-input
                      v-model="form.content"
                      type="textarea"
                      :rows="8"
                      placeholder="请输入新闻内容"
                      resize="none"
                    />
                  </el-form-item>
                  
                  <el-form-item prop="category">
                    <el-select 
                      v-model="form.category"
                      placeholder="请选择新闻类别"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in categories"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>

                  <!-- 添加辅助提示 -->
                  <div class="input-tips">
                    <div class="tip-item">
                      <el-icon><info-filled /></el-icon>
                      <span>标题建议在 10-50 字之间</span>
                    </div>
                    <div class="tip-item">
                      <el-icon><info-filled /></el-icon>
                      <span>内容建议在 100-5000 字之间</span>
                    </div>
                    <div class="tip-item">
                      <el-icon><document /></el-icon>
                      <span>支持 PDF、DOCX、DOC 格式，单个文件不超过 10MB</span>
                    </div>
                  </div>

                  <el-form-item>
                    <div class="form-actions">
                      <div class="action-group">
                        <el-button 
                          type="primary" 
                          class="verify-btn" 
                          @click="handleSubmit" 
                          :loading="loading"
                        >
                          <div class="btn-content">
                            <el-icon><Search /></el-icon>
                            <span>开始检测</span>
                            <div class="btn-glow"></div>
                          </div>
                        </el-button>
                        <el-tooltip
                          content="支持批量上传检测"
                          placement="top"
                          effect="light"
                        >
                          <div class="batch-hint" @click="handleBatchUpload">
                            <el-icon><Files /></el-icon>
                            <!-- 添加隐藏的文件上传输入框 -->
                            <input
                              ref="fileInputRef"
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx"
                              class="hidden-input"
                              @change="handleFileChange"
                            />
                          </div>
                        </el-tooltip>
                      </div>
                      <el-button 
                        :class="['clear-btn', { 'danger-hover': showClearConfirm }]" 
                        @click="handleClear"
                        :disabled="loading"
                      >
                        <div class="btn-content">
                          <el-icon :class="{ 'warning-icon': showClearConfirm }">
                            <Delete />
                          </el-icon>
                          <span>清空内容</span>
                        </div>
                        <div 
                          class="btn-progress" 
                          :style="{ width: clearProgress + '%' }"
                        ></div>
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane name="image">
                <template #label>
                  <div class="tab-label">
                    <el-icon><Picture /></el-icon>
                    <span>图片检测</span>
                  </div>
                </template>
                <!-- 图片检测区域 -->
                <div class="image-verify">
                  <div class="upload-container">
                    <div class="upload-area">
                      <!-- 上传区域 -->
                      <el-upload
                        v-if="!imageUrl"
                        class="upload-area"
                        drag
                        :show-file-list="false"
                        :before-upload="beforeImageUpload"
                        :http-request="handleImageUpload"
                      >
                        <div class="upload-content">
                          <el-icon class="upload-icon"><Picture /></el-icon>
                          <div class="upload-text">
                            <h3>点击或拖拽图片到此处</h3>
                            <p class="upload-hint">支持 JPG、PNG 格式，单张图片不超过 5MB</p>
                          </div>
                          <div class="supported-formats">
                            <span class="format-tag">JPG</span>
                            <span class="format-tag">PNG</span>
                          </div>
                        </div>
                      </el-upload>

                      <!-- 预览区域 -->
                      <div v-else class="image-preview">
                        <div class="preview-header">
                          <div class="image-info">
                            <el-icon><Picture /></el-icon>
                            <span class="image-name">{{ imageUrl.split('/').pop() }}</span>
                          </div>
                          <el-button 
                            type="danger" 
                            size="small"
                            @click="removeImage"
                            :disabled="loading"
                          >
                            <el-icon><Delete /></el-icon>
                            删除图片
                          </el-button>
                        </div>

                        <div class="preview-wrapper">
                          <el-image
                            :src="imageUrl"
                            :preview-src-list="[imageUrl]"
                            fit="contain"
                            class="preview-image"
                          >
                            <template #placeholder>
                              <div class="image-loading">
                                <el-icon class="rotating"><Loading /></el-icon>
                                <span>加载中...</span>
                              </div>
                            </template>
                          </el-image>
                        </div>

                        <!-- 操作区域 -->
                        <div class="image-actions">
                          <el-button 
                            type="primary"
                            :loading="loading"
                            @click="handleImageVerify"
                            class="verify-btn"
                          >
                            <el-icon><Search /></el-icon>
                            开始检测
                          </el-button>
                        </div>

                        <!-- 检测进度 -->
                        <div v-if="loading" class="detection-progress">
                          <div class="progress-info">
                            <span>检测进度</span>
                            <span>{{ Math.round(detectionProgress) }}%</span>
                          </div>
                          <div class="progress-bar">
                            <div 
                              class="progress-fill"
                              :style="{ width: `${detectionProgress}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane name="video">
                <template #label>
                  <div class="tab-label">
                    <el-icon><VideoCamera /></el-icon>
                    <span>视频检测</span>
                  </div>
                </template>
                
                <div class="video-verify">
                  <div class="upload-container">
                    <div v-if="!videoUrl" class="upload-area video-upload">
                      <el-upload
                        class="upload-dragger"
                        drag
                        :show-file-list="false"
                        :before-upload="beforeVideoUpload"
                        :http-request="handleVideoUpload"
                      >
                        <div class="upload-content">
                          <el-icon class="upload-icon"><VideoCamera /></el-icon>
                          <div class="upload-text">
                            <h3>点击或拖拽视频到此处</h3>
                            <p class="upload-hint">支持 MP4 格式，单个视频不超过 500MB</p>
                          </div>
                          <div class="supported-formats">
                            <span class="format-tag">MP4</span>
                            <span class="format-tag">MOV</span>
                            <span class="format-tag">AVI</span>
                          </div>
                        </div>
                      </el-upload>
                    </div>

                    <div v-else class="video-preview">
                      <!-- 视频信息和删除按钮 -->
                      <div class="video-header">
                        <div class="video-info">
                          <el-icon><VideoCamera /></el-icon>
                          <div class="info-details">
                            <span class="video-name">{{ getVideoName(videoUrl) }}</span>
                            <span class="video-size">{{ formatFileSize(videoSize) }}</span>
                          </div>
                        </div>
                        <el-button 
                          type="danger"
                          plain
                          size="small"
                          @click="removeVideo"
                          :disabled="loading"
                          class="video-delete-btn"
                        >
                          <el-icon><Delete /></el-icon>
                          删除视频
                        </el-button>
                      </div>

                      <!-- 视频播放器 -->
                      <div class="video-player">
                        <video
                          ref="videoPlayer"
                          :src="videoUrl"
                          class="preview-video"
                          controls
                          controlsList="nodownload"
                        >
                          您的浏览器不支持视频播放
                        </video>
                      </div>

                      <div class="detection-controls">
                        <div class="control-buttons">
                          <el-button 
                            type="primary" 
                            :loading="loading"
                            :disabled="!videoUrl"
                            @click="handleVideoVerify"
                            class="verify-button"
                          >
                            <div class="button-content">
                              <el-icon><Search /></el-icon>
                              <span>开始检测</span>
                            </div>
                          </el-button>
                          
                          <!-- 添加删除视频按钮 -->
                          <el-button 
                            type="danger"
                            :disabled="loading"
                            @click="removeVideo"
                            class="delete-video-btn"
                          >
                            <div class="button-content">
                              <el-icon><Delete /></el-icon>
                              <span>删除视频</span>
                            </div>
                          </el-button>
                        </div>
                        
                        <div class="detection-tips" v-if="!loading">
                          <el-icon><InfoFilled /></el-icon>
                          <span>视频检测可能需要较长时间，请耐心等待</span>
                        </div>
                      </div>

                      <div v-if="videoDetectionProgress > 0" class="detection-progress">
                        <div class="progress-info">
                          <span class="progress-text">检测进度</span>
                          <span class="progress-value">{{ Math.round(videoDetectionProgress) }}%</span>
                        </div>
                        <el-progress 
                          :percentage="videoDetectionProgress"
                          :stroke-width="8"
                          :show-text="false"
                          class="progress-bar"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane name="dispute">
                <template #label>
                  <div class="tab-label">
                    <el-icon><Warning /></el-icon>
                    <span>质疑通道</span>
                  </div>
                </template>
                <!-- 质疑通道区域 -->
                <div class="dispute-channel">
                  <div class="channel-header">
                    <div class="header-content">
                      <div class="header-icon">
                        <el-icon><Warning /></el-icon>
                      </div>
                      <div class="header-text">
                        <h2 class="channel-title">质疑通道</h2>
                        <p class="channel-subtitle">帮助我们提升检测准确性</p>
                      </div>
                    </div>
                    <p class="channel-description">
                      如果您认为检测结果存在问题，请提供详细信息和相关证据。我们将认真审核每一条质疑，并在3个工作日内给出回复。
                    </p>
                  </div>

                  <div class="dispute-form">
                    <el-form ref="disputeFormRef" :model="disputeForm" :rules="disputeRules">
                      <el-form-item prop="title">
                        <div class="form-label">
                          <span class="label-text">质疑标题</span>
                          <span class="label-required">*</span>
                        </div>
                        <el-input 
                          v-model="disputeForm.title"
                          placeholder="请输入质疑标题"
                          :maxlength="50"
                          show-word-limit
                        />
                      </el-form-item>
                      
                      <el-form-item prop="content">
                        <div class="form-label">
                          <span class="label-text">质疑内容</span>
                          <span class="label-required">*</span>
                        </div>
                        <el-input
                          v-model="disputeForm.content"
                          type="textarea"
                          :rows="8"
                          placeholder="请输入质疑内容"
                          resize="none"
                          :maxlength="1000"
                          show-word-limit
                        />
                      </el-form-item>
                      
                      <el-form-item prop="category">
                        <div class="form-label">
                          <span class="label-text">质疑类别</span>
                          <span class="label-required">*</span>
                        </div>
                        <el-select 
                          v-model="disputeForm.category"
                          placeholder="请选择质疑类别"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in disputeCategories"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>

                      <el-form-item prop="evidence">
                        <div class="form-label">
                          <span class="label-text">补充证据</span>
                          <span class="label-optional">(选填)</span>
                        </div>
                        <div class="evidence-upload">
                          <el-upload
                            ref="uploadRef"
                            :auto-upload="false"
                            :limit="5"
                            :on-exceed="handleExceed"
                            :before-upload="beforeEvidenceUpload"
                            :on-change="handleEvidenceChange"
                            multiple
                            drag
                          >
                            <div class="upload-content">
                              <el-icon class="upload-icon"><Upload /></el-icon>
                              <div class="upload-text">
                                <p>点击或拖拽文件到此处上传</p>
                                <span class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式，单个文件不超过 10MB</span>
                              </div>
                            </div>
                          </el-upload>
                        </div>
                      </el-form-item>

                      <el-form-item prop="contact">
                        <div class="form-label">
                          <span class="label-text">联系方式</span>
                          <span class="label-optional">(选填)</span>
                        </div>
                        <el-input
                          v-model="disputeForm.contact"
                          placeholder="请留下您的联系方式，以便我们及时反馈"
                        >
                          <template #prefix>
                            <el-icon><Message /></el-icon>
                          </template>
                        </el-input>
                        <div class="form-tip">我们将对您的联系方式严格保密</div>
                      </el-form-item>

                      <el-form-item>
                        <div class="form-actions">
                          <el-button 
                            type="primary" 
                            class="submit-btn" 
                            @click="handleDisputeSubmit" 
                            :loading="disputeLoading"
                          >
                            <div class="btn-content">
                              <el-icon><Position /></el-icon>
                              <span>提交质疑</span>
                            </div>
                          </el-button>
                          <el-button 
                            type="default"
                            @click="handleDisputeClear"
                            :disabled="disputeLoading"
                          >
                            重置表单
                          </el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="card-footer">
              <div class="footer-tip">
                <el-icon><info-filled /></el-icon>
                <span>支持多种格式的新闻内容检测，实时分析结果</span>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 检测结果 -->
        <div class="verify-result">
          <transition name="fade-slide">
            <div v-if="verificationResult" class="result-section glass-effect">
              <!-- 结果头部 -->
              <div class="result-header">
                <div class="result-title">
                  <div class="title-icon">
                    <el-icon><data-analysis /></el-icon>
                  </div>
                  <div class="title-content">
                    <h2>{{ verificationResult.title }}</h2>
                    <div class="result-meta">
                      <span class="result-category">
                        {{ getCategoryText(verificationResult.category) }}
                      </span>
                      <span class="result-source">
                        <el-icon><link /></el-icon>
                        {{ verificationResult.source }}
                      </span>
                      <span class="result-time">
                        <el-icon><timer /></el-icon>
                        {{ new Date(verificationResult.verifiedAt).toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="result-actions">
                  <el-button 
                    type="primary"
                    @click="handleExport"
                    class="export-btn"
                  >
                    <el-icon><Download /></el-icon>
                    导出报告
                  </el-button>
                </div>
              </div>
              <!-- 添加标签页组件 -->
              <el-tabs v-model="activeResultTab" class="result-tabs">
                <el-tab-pane label="基础分析" name="basic" class="result-tab-pane">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><DataAnalysis /></el-icon>
                      <span>基础分析</span>
                    </div>
                  </template>
                  
                  <!-- 基础分析内容 -->
                  <div class="basic-analysis">
                    <!-- 可信度概览 -->
                    <div class="credibility-overview">
                      <div class="overview-main">
                        <div class="score-display">
                          <div class="score-circle">
                            <svg viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="rgba(64, 169, 255, 0.1)"
                                stroke-width="2"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                :stroke="getScoreColor(verificationResult.credibility)"
                                stroke-width="2"
                                :stroke-dasharray="`${verificationResult.credibility * 100}, 100`"
                                class="score-path"
                              />
                            </svg>
                            <div class="score-text">
                              <div class="score-value">{{ Math.round(verificationResult.credibility * 100) }}</div>
                              <div class="score-unit">分</div>
                            </div>
                          </div>
                          <div class="score-info">
                            <div class="info-title">可信度评级</div>
                            <div :class="['info-level', getScoreLevelClass(verificationResult.credibility)]">
                              {{ getScoreLevelText(verificationResult.credibility) }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="score-metrics">
                          <div v-for="detail in verificationResult.details" 
                               :key="detail.type" 
                               class="metric-item"
                          >
                            <div class="metric-header">
                              <span class="metric-name">{{ getDetailTypeText(detail.type) }}</span>
                              <span class="metric-value">{{ Math.round(detail.score * 100) }}%</span>
                            </div>
                            <div class="metric-bar">
                              <div 
                                class="bar-progress"
                                :style="{
                                  width: `${detail.score * 100}%`,
                                  backgroundColor: getScoreColor(detail.score)
                                }"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 分析模块 -->
                    <div class="analysis-modules">
                      <div v-for="detail in verificationResult.details"
                           :key="detail.type"
                           class="analysis-module"
                      >
                        <div class="module-header">
                          <div class="module-icon">
                            <el-icon :class="getDetailIcon(detail.type)"></el-icon>
                          </div>
                          <div class="module-title">{{ getDetailTypeText(detail.type) }}</div>
                          <div class="module-score">{{ Math.round(detail.score * 100) }}%</div>
                        </div>
                        
                        <div class="module-content">
                          <div class="analysis-item">
                            <div class="item-title">分析说明</div>
                            <div class="item-description">{{ detail.explanation }}</div>
                            <div class="evidence-list">
                              <span v-for="(evidence, index) in detail.evidence"
                                    :key="index"
                                    class="evidence-tag"
                              >{{ evidence }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane name="forgery" class="result-tab-pane">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><warning /></el-icon>
                      <span>伪造分析</span>
                    </div>
                  </template>
                  
                  <!-- 伪造分析内容 -->
                  <div class="forgery-analysis">
                    <div class="section-header">
                      <el-icon><warning /></el-icon>
                      <h3>伪造特征分析</h3>
                    </div>
                    
                    <div class="forgery-level">
                      <div :class="['level-badge', verificationResult.credibility < 0.3 ? 'severe' : 'moderate']">
                        {{ getForgeryLevel(verificationResult.credibility) }}
                      </div>
                      <p>{{ getForgeryDescription(verificationResult.credibility) }}</p>
                    </div>
                    
                    <div class="pattern-grid">
                      <div v-for="(pattern, index) in getForgeryPatterns(verificationResult)"
                           :key="index"
                           class="pattern-card"
                      >
                        <div class="pattern-header">
                          <el-icon :class="pattern.icon"></el-icon>
                          <span>{{ pattern.name }}</span>
                        </div>
                        <p class="pattern-desc">{{ pattern.description }}</p>
                        <div class="pattern-evidence">
                          <el-tag 
                            v-for="(evidence, idx) in pattern.evidence"
                            :key="idx"
                            size="small"
                            effect="light"
                          >{{ evidence }}</el-tag>
                        </div>
                      </div>
                    </div>
                    
                    <div class="tips-section">
                      <h4>验证建议</h4>
                      <ul class="tips-list">
                        <li v-for="(tip, index) in getForgeryTips(verificationResult)"
                            :key="index"
                        >{{ tip }}</li>
                      </ul>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 新增质疑通道标签页 -->
                <el-tab-pane name="dispute" class="result-tab-pane">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><Warning /></el-icon>
                      <span>质疑通道</span>
                    </div>
                  </template>
                  
                  <div class="dispute-channel">
                    <div class="channel-header">
                      <div class="header-content">
                        <div class="header-icon">
                          <el-icon><Warning /></el-icon>
                        </div>
                        <div class="header-text">
                          <h2 class="channel-title">质疑通道</h2>
                          <p class="channel-subtitle">帮助我们提升检测准确性</p>
                        </div>
                      </div>
                      <p class="channel-description">
                        如果您认为检测结果存在问题，请提供详细信息和相关证据。我们将认真审核每一条质疑，并在3个工作日内给出回复。
                      </p>
                    </div>

                    <div class="dispute-form">
                      <el-form ref="disputeFormRef" :model="disputeForm" :rules="disputeRules">
                        <el-form-item prop="title">
                          <div class="form-label">
                            <span class="label-text">质疑标题</span>
                            <span class="label-required">*</span>
                          </div>
                          <el-input 
                            v-model="disputeForm.title"
                            placeholder="请输入质疑标题"
                            :maxlength="50"
                            show-word-limit
                          />
                        </el-form-item>
                        
                        <el-form-item prop="content">
                          <div class="form-label">
                            <span class="label-text">质疑内容</span>
                            <span class="label-required">*</span>
                          </div>
                          <el-input
                            v-model="disputeForm.content"
                            type="textarea"
                            :rows="8"
                            placeholder="请输入质疑内容"
                            resize="none"
                            :maxlength="1000"
                            show-word-limit
                          />
                        </el-form-item>
                        
                        <el-form-item prop="category">
                          <div class="form-label">
                            <span class="label-text">质疑类别</span>
                            <span class="label-required">*</span>
                          </div>
                          <el-select 
                            v-model="disputeForm.category"
                            placeholder="请选择质疑类别"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in disputeCategories"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>

                        <el-form-item prop="evidence">
                          <div class="form-label">
                            <span class="label-text">补充证据</span>
                            <span class="label-optional">(选填)</span>
                          </div>
                          <div class="evidence-upload">
                            <el-upload
                              ref="uploadRef"
                              :auto-upload="false"
                              :limit="5"
                              :on-exceed="handleExceed"
                              :before-upload="beforeEvidenceUpload"
                              :on-change="handleEvidenceChange"
                              multiple
                              drag
                            >
                              <div class="upload-content">
                                <el-icon class="upload-icon"><Upload /></el-icon>
                                <div class="upload-text">
                                  <p>点击或拖拽文件到此处上传</p>
                                  <span class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式，单个文件不超过 10MB</span>
                                </div>
                              </div>
                            </el-upload>
                          </div>
                        </el-form-item>

                        <el-form-item prop="contact">
                          <div class="form-label">
                            <span class="label-text">联系方式</span>
                            <span class="label-optional">(选填)</span>
                          </div>
                          <el-input
                            v-model="disputeForm.contact"
                            placeholder="请留下您的联系方式，以便我们及时反馈"
                          >
                            <template #prefix>
                              <el-icon><Message /></el-icon>
                            </template>
                          </el-input>
                          <div class="form-tip">我们将对您的联系方式严格保密</div>
                        </el-form-item>

                        <el-form-item>
                          <div class="form-actions">
                            <el-button 
                              type="primary" 
                              class="submit-btn" 
                              @click="handleDisputeSubmit" 
                              :loading="disputeLoading"
                            >
                              <div class="btn-content">
                                <el-icon><Position /></el-icon>
                                <span>提交质疑</span>
                              </div>
                            </el-button>
                            <el-button 
                              type="default"
                              @click="handleDisputeClear"
                              :disabled="disputeLoading"
                            >
                              重置表单
                            </el-button>
                          </div>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div v-else class="empty-state glass-effect">
              <div class="empty-content">
                <!-- 优化空状态展示 -->
                <div class="empty-header">
                  <div class="empty-icon-wrapper">
                    <el-icon class="empty-icon"><DataAnalysis /></el-icon>
                    <div class="icon-pulse"></div>
                    <div class="icon-ring"></div>
                  </div>
                  <h3 class="empty-title">开始您的新闻真实性检测</h3>
                  <p class="empty-desc">AI驱动的多维度分析系统</p>
                </div>
                
                <!-- 添加功能特点展示 -->
                <div class="feature-showcase">
                  <div class="feature-card">
                    <div class="feature-icon">
                      <el-icon><Cpu /></el-icon>
                    </div>
                    <h4>AI智能分析</h4>
                    <p>采用先进的深度学习算法</p>
                    <div class="feature-stats">
                      <div class="stat-item">
                        <span class="stat-value">99.9%</span>
                        <span class="stat-label">准确率</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon">
                      <el-icon><Timer /></el-icon>
                    </div>
                    <h4>实时检测</h4>
                    <p>秒级响应的检测系统</p>
                    <div class="feature-stats">
                      <div class="stat-item">
                        <span class="stat-value">&lt;1s</span>
                        <span class="stat-label">响应时间</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon">
                      <el-icon><DataLine /></el-icon>
                    </div>
                    <h4>多维分析</h4>
                    <p>全方位数据可视化</p>
                    <div class="feature-stats">
                      <div class="stat-item">
                        <span class="stat-value">8+</span>
                        <span class="stat-label">分析维度</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 添加分析流程展示 -->
                <div class="analysis-flow">
                  <div class="flow-title">
                    <el-icon><Connection /></el-icon>
                    <span>智能分析流程</span>
                  </div>
                  <div class="flow-steps">
                    <div class="flow-step">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h5>输入检测</h5>
                        <p>支持文本/图片/视频</p>
                      </div>
                      <div class="step-progress"></div>
                    </div>
                    <div class="flow-step">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h5>AI分析</h5>
                        <p>深度学习模型处理</p>
                      </div>
                      <div class="step-progress"></div>
                    </div>
                    <div class="flow-step">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h5>结果展示</h5>
                        <p>可视化分析报告</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showSampleTip"
      title="样例说明"
      width="500px"
      class="sample-dialog"
    >
      <div class="sample-tip-content">
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <p>这是一个演示用的新闻样例，您可以：</p>
          <ul>
            <li>查看样例的检测结果</li>
            <li>修改内容后重新检测</li>
            <li>了解系统的检测能力</li>
          </ul>
        </el-alert>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-checkbox v-model="dontShowAgain">不再提示</el-checkbox>
          <el-button type="primary" @click="closeSampleTip">
            知道了
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  Delete,
  Search,
  VideoCamera,
  Document,
  Monitor,
  DataAnalysis,
  Picture,
  Warning,
  InfoFilled,
  Download,
  Connection,
  Check,
  Timer,
  ArrowRight,
  DataLine,
  Loading,
  Cpu,
  Files} from '@element-plus/icons-vue'
import type { NewsCategory, VerificationResult } from '@/types'
import { newsApi } from '@/api' // 添加这一行
import { Message, Position, Upload } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps } from 'element-plus'

// 添加质疑表单相关的类型定义
interface DisputeForm {
  reason: string
  evidence: File[]
  contact: string
  title: string
  content: string
  category: string
}

interface DisputeActivity {
  type: string
  time: string
  content: string
}

interface DisputeStatus {
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  activities: DisputeActivity[]
}

// 添加质疑类别常量
const disputeCategories = [
  { value: 'result', label: '结果质疑' },
  { value: 'method', label: '方法质疑' },
  { value: 'data', label: '数据质疑' },
  { value: 'other', label: '其他' }
]

// 修改表单数据结构
const disputeForm = ref<DisputeForm>({
  reason: '',
  evidence: [],
  contact: '',
  title: '',
  content: '',
  category: ''
})

const disputeRules = {
  reason: [
    { required: true, message: '请输入质疑理由', trigger: 'blur' },
    { min: 10, max: 500, message: '理由长度在10-500个字符之间', trigger: 'blur' }
  ]
}

const disputeLoading = ref(false)
const disputeStatus = ref<DisputeStatus | null>(null)
const disputeFormRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()

// 处理文件上传前的验证
const beforeEvidenceUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = /\.(pdf|doc|docx|jpg|png)$/i.test(file.name)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('不支持的文件格式')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  return true
}

// 处理超出文件数量限制
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('最多只能上传5个补充证据文件')
}

// 处理文件变化
const handleEvidenceChange: UploadProps['onChange'] = (file) => {
  if (file.raw) {
    disputeForm.value.evidence.push(file.raw)
  }
}

// 添加质疑表单提交处理方法
const handleDisputeSubmit = async () => {
  if (!disputeFormRef.value) return
  
  await disputeFormRef.value.validate(async (valid) => {
    if (valid) {
      disputeLoading.value = true
      try {
        // 构建表单数据
        const formData = new FormData()
        formData.append('title', disputeForm.value.title)
        formData.append('content', disputeForm.value.content)
        formData.append('category', disputeForm.value.category)
        formData.append('contact', disputeForm.value.contact)
        
        // 添加证据文件
        disputeForm.value.evidence.forEach(file => {
          formData.append('evidence', file)
        })

        // 发送质疑请求
        
        // 更新质疑状态
        disputeStatus.value = {
          status: 'pending',
          activities: [
            {
              type: 'primary',
              time: new Date().toLocaleString(),
              content: '质疑申请已提交，等待处理'
            }
          ]
        }
        
        ElMessage.success('质疑提交成功，我们会尽快处理')
        // 重置表单
        handleDisputeClear()
      } catch (error) {
        console.error('提交质疑失败:', error)
        ElMessage.error('提交失败，请稍后重试')
      } finally {
        disputeLoading.value = false
      }
    }
  })
}

// 添加质疑表单清空方法
const handleDisputeClear = () => {
  if (disputeFormRef.value) {
    disputeFormRef.value.resetFields()
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  disputeForm.value = {
    title: '',
    content: '',
    category: '',
    reason: '',
    evidence: [],
    contact: ''
  }
}

// 获取质疑状态类型

// 获取质疑状态文本

const formRef = ref<FormInstance>()
const chartRef = ref<HTMLElement>()
const wordCloudRef = ref(null)
let wordCloudChart: echarts.ECharts | null = null
const loading = ref(false)
const verificationResult = ref<VerificationResult | null>(null)
const activeTab = ref<string | number>('text')
const videoUrl = ref('')
const imageUrl = ref('')
const chart = ref<echarts.ECharts | null>(null)

const form = ref({
  title: '',
  content: '',
  category: '' as NewsCategory
})

const categories = [
  { label: '政治', value: 'politics' },
  { label: '科技', value: 'technology' },
  { label: '经济', value: 'economy' },
  { label: '社会', value: 'society' },
  { label: '国际', value: 'international' },
  { label: '其他', value: 'other' }
]

const rules: FormRules = {
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2-100个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' },
    { min: 10, max: 5000, message: '内容长度在10-5000个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择新闻类别', trigger: 'change' }
  ]
}


// 添加结果动画控制
const showResultAnimation = ref(false)

// 修改 handleSubmit 函数
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      showResultAnimation.value = false
      
      try {
        const response = await newsApi.detectText({
          title: form.value.title,
          text: form.value.content
        })
        
        // 构造完整的检测结果
        verificationResult.value = {
          id: `text_${Date.now()}`,
          title: form.value.title,
          content: form.value.content,
          category: form.value.category,
          credibility: response.data.credibility,
          source: '文本检测系统',
          verifiedAt: new Date().toISOString(),
          summary: response.data.summary || '文本真实性分析结果',
          score: response.data.credibility,
          // 添加缺失的必需属性
          sourceScore: response.data.sourceScore || response.data.credibility * 0.9,
          sourceEvidence: response.data.sourceEvidence || ['来源可靠性分析', '信息溯源检查'],
          textScore: response.data.textScore || response.data.credibility * 0.95,
          textEvidence: response.data.textEvidence || ['文本语义分析', '内容一致性检查'],
          details: [
            {
              type: 'factCheck',
              score: response.data.credibility,
              explanation: '事实准确性分析',
              evidence: [
                '关键信息核实',
                '事实一致性检查',
                '数据准确性验证'
              ]
            },
            {
              type: 'sourceAnalysis',
              score: response.data.sourceScore || response.data.credibility * 0.9,
              explanation: '来源可靠性分析',
              evidence: response.data.sourceEvidence || [
                '来源权威性评估',
                '发布渠道验证',
                '信息溯源分析'
              ]
            },
            {
              type: 'textAnalysis',
              score: response.data.textScore || response.data.credibility * 0.9,
              explanation: '内容完整性分析',
              evidence: response.data.textEvidence || [
                '语义连贯性检查',
                '逻辑结构分析',
                '内容完整性评估'
              ]
            }
          ]
        }

        nextTick(() => {
          showResultAnimation.value = true
          initChart()
          updateVisualizations()
          scrollToResults()
        })
        
        ElMessage.success('检测完成')
      } catch (error) {
        console.error('检测失败:', error)
        ElMessage.error('检测失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 添加更新可视化的方法
const updateVisualizations = () => {
  if (!wordCloudChart) {
    initWordCloud()
  }
  updateWordCloud()
}

// 添加滚动到结果的方法
const scrollToResults = () => {
  const resultSection = document.querySelector('.result-section')
  resultSection?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}

// 优化分析说明文本

const showClearConfirm = ref(false)
const clearProgress = ref(0)
let clearTimer: number | null = null

const handleClear = () => {
  if (!showClearConfirm.value) {
    showClearConfirm.value = true
    return
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
  verificationResult.value = null
  ElMessage.success('内容已清空')
}

watch(showClearConfirm, (newVal) => {
  if (newVal) {
    clearProgress.value = 0
    clearTimer = window.setInterval(() => {
      clearProgress.value += 2
      if (clearProgress.value >= 100) {
        handleClear()
        showClearConfirm.value = false
        clearProgress.value = 0
        if (clearTimer) {
          clearInterval(clearTimer)
          clearTimer = null
        }
      }
    }, 20)
  } else {
    if (clearTimer) {
      clearInterval(clearTimer)
    }
    clearProgress.value = 0
  }
})

onUnmounted(() => {
  if (clearTimer) {
    clearInterval(clearTimer)
  }
})

const beforeImageUpload = (file: File) => {
  const isImage = /^image\/(jpeg|png|gif)$/.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  return true
}

const handleImageUpload = async (options: UploadRequestOptions) => {
  const file = options.file as File
  loading.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      imageUrl.value = e.target?.result as string
      ElMessage.success('图片上传成功')
    }
    reader.readAsDataURL(file)
  } catch (error) {
    ElMessage.error('图片上传失败')
  } finally {
    loading.value = false
  }
}

const detectionProgress = ref(0)

// 修改检测函数以支持进度显示
const handleImageVerify = async () => {
  if (!imageUrl.value) {
    ElMessage.warning('请先上传图片')
    return
  }
  
  loading.value = true
  detectionProgress.value = 0
  
  try {
    // 模拟检测进度
    const progressInterval = setInterval(() => {
      if (detectionProgress.value < 90) {
        detectionProgress.value += Math.random() * 10
      }
    }, 200)

    const response = await fetch(imageUrl.value)
    const blob = await response.blob()
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
    
    const result = await newsApi.detectImage(file)
    
    clearInterval(progressInterval)
    detectionProgress.value = 100
    // 构造完整的 VerificationResult 对象
    verificationResult.value = {
      id: `img_${Date.now()}`,
      title: '图片分析结果',
      content: '图片真实性检测',
      category: 'technology' as NewsCategory,
      credibility: result.data.credibility,
      source: '图片检测系统',
      verifiedAt: new Date().toISOString(),
      summary: `图片真实性检测结果：${result.data.label === 'Real' ? '真实' : '伪造'}`,
      score: result.data.credibility,
      // 添加缺失的必需属性
      sourceScore: result.data.sourceScore || result.data.credibility * 0.9,
      sourceEvidence: result.data.sourceEvidence || ['图片元数据检查', '图片来源追溯'],
      textScore: result.data.textScore || result.data.credibility * 0.95,
      textEvidence: result.data.textEvidence || ['图像特征分析', '内容一致性验证'],
      details: [
        {
          type: 'factCheck',
          score: result.data.credibility,
          explanation: `图片真实性分析结果：${result.data.label === 'Real' ? '真实' : '伪造'}`,
          evidence: [`可信度：${(result.data.credibility * 100).toFixed(2)}%`]
        },
        {
          type: 'sourceAnalysis',
          score: result.data.credibility * 0.9,
          explanation: '图片来源分析',
          evidence: ['图片元数据完整性检查', '图片格式验证']
        },
        {
          type: 'textAnalysis',
          score: result.data.credibility * 0.95,
          explanation: '图片内容分析',
          evidence: ['图像特征提取', '内容一致性验证']
        }
      ]
    }
    
    ElMessage.success('图片检测完成')
  } catch (error) {
    console.error('图片检测失败:', error)
    ElMessage.error('图片检测失败')
  } finally {
    loading.value = false
  }
}

const removeImage = () => {
  imageUrl.value = ''
  verificationResult.value = null
}

const initChart = () => {
  if (!chartRef.value) return
  
  if (chart.value) {
    chart.value.dispose()
  }
  
  chart.value = echarts.init(chartRef.value)
  
  if (!verificationResult.value) {
    const emptyOption = {
      radar: {
        indicator: [
          { name: '事实核查', max: 100 },
          { name: '来源分析', max: 100 },
          { name: '文本分析', max: 100 }
        ],
        splitArea: {
          areaStyle: {
            color: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)']
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [0, 0, 0],
          name: '分析维度',
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.2)'
          },
          lineStyle: {
            color: '#409EFF'
          },
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }]
    }
    chart.value.setOption(emptyOption)
    return
  }
  
  const scores = verificationResult.value.details.map(detail => detail.score * 100)
  
  const option = {
    radar: {
      indicator: [
        { name: '事实核查', max: 100 },
        { name: '来源分析', max: 100 },
        { name: '文本分析', max: 100 }
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)']
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: scores,
        name: '分析维度',
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.2)'
        },
        lineStyle: {
          color: '#409EFF'
        },
        itemStyle: {
          color: '#409EFF'
        }
      }]
    }]
  }
  
  chart.value.setOption(option)
}

watch(() => verificationResult.value, () => {
  nextTick(() => {
    initChart()
    updateWordCloud()
  })
}, { deep: true })

const handleResize = () => {
  nextTick(() => {
    chart.value?.resize()
  })
}

onMounted(() => {
  if (verificationResult.value) {
    initChart()
    initWordCloud()
    updateWordCloud()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart.value) {
    chart.value.dispose()
  }
  if (wordCloudChart) {
    wordCloudChart.dispose()
  }
})

const newsSamples = [
  {
    id: 1,
    title: '科技创新突破',
    content: '近日，某研究团队宣布在量子计算领域取得重大突破成功实现了100量比特的稳定控制...',
    category: 'technology' as NewsCategory
  },
  {
    id: 2,
    title: '环保新政策实施',
    content: '国家发改委今日发布新的环保政策，要求所有工业企业在2025年前完成清洁能源改造...',
    category: 'politics' as NewsCategory
  },
  {
    id: 3,
    title: '经济发展新动态',
    content: '第一季度GDP同比增长6.8%，各经济指标稳中向好，显示经济复苏势头强劲...',
    category: 'economy' as NewsCategory
  }
]

const showSampleTip = ref(!localStorage.getItem('sampleTipShown'))
const dontShowAgain = ref<string | boolean | number>(false)

const handleSampleSelect = (sample: typeof newsSamples[0]) => {
  form.value.title = sample.title
  form.value.content = sample.content
  form.value.category = sample.category
  activeTab.value = 'text'
  
  if (!localStorage.getItem('sampleTipShown')) {
    showSampleTip.value = true
  }
}

const closeSampleTip = () => {
  showSampleTip.value = false
  if (dontShowAgain.value) {
    localStorage.setItem('sampleTipShown', 'true')
  }
}

// 新增的视频相关状态
const videoSize = ref(0)
const videoDetectionProgress = ref(0)
const videoPlayer = ref<HTMLVideoElement | null>(null)

// 获取视频文件名
const getVideoName = (url: string) => {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 视频上传前检查
const beforeVideoUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isVideo) {
    ElMessage.error('只能上传视频文件！')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('视频大小不能超过 500MB！')
    return false
  }
  return true
}

// 处理视频上传
const handleVideoUpload = async (options: UploadRequestOptions) => {
  const file = options.file as File
  videoSize.value = file.size
  
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      videoUrl.value = e.target?.result as string
      ElMessage.success('视频上传成功')
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('视频上传失败:', error)
    ElMessage.error('视频上传失败')
  }
}

// 模拟检测进度
const simulateDetectionProgress = () => {
  videoDetectionProgress.value = 0
  const interval = setInterval(() => {
    if (videoDetectionProgress.value < 90) {
      videoDetectionProgress.value += Math.random() * 10
    }
    if (!loading.value) {
      videoDetectionProgress.value = 100
      setTimeout(() => {
        videoDetectionProgress.value = 0
      }, 1000)
      clearInterval(interval)
    }
  }, 1000)
}

// 处理视频检测
const handleVideoVerify = async () => {
  if (!videoUrl.value) {
    ElMessage.warning('请先上传视频')
    return
  }
  
  loading.value = true
  simulateDetectionProgress()
  
  try {
    const response = await fetch(videoUrl.value)
    const blob = await response.blob()
    const file = new File([blob], 'video.mp4', { type: 'video/mp4' })
    
    const result = await newsApi.detectVideo(file)
    
    verificationResult.value = {
      id: `video_${Date.now()}`,
      title: '视频分析结果',
      content: '视频真实性检测',
      category: 'technology' as NewsCategory,
      credibility: result.data.score,
      source: '视频检测系统',
      verifiedAt: new Date().toISOString(),
      summary: `视频真实性检测结果：${result.data.label === 'Real' ? '真实' : '伪造'}`,
      score: result.data.score,
      // 添加缺失的必需属性
      sourceScore: result.data.sourceScore || result.data.score * 0.9,
      sourceEvidence: result.data.sourceEvidence || ['视频元数据检查', '视频来源追溯'],
      textScore: result.data.textScore || result.data.score * 0.95,
      textEvidence: result.data.textEvidence || ['视频帧分析', '音视频同步性检查'],
      details: [
        {
          type: 'factCheck',
          score: result.data.score,
          explanation: `视频真实性检测结果：${result.data.label === 'Real' ? '真实' : '伪造'}`,
          evidence: [`置信度：${(result.data.score * 100).toFixed(2)}%`]
        },
        {
          type: 'sourceAnalysis',
          score: result.data.score * 0.91,
          explanation: '视频来源分析',
          evidence: ['视频元数据检查', '编码格式验证']
        },
        {
          type: 'textAnalysis',
          score: result.data.score * 0.93,
          explanation: '视频内容分析',
          evidence: ['帧序列分析', '音视频同步性检查']
        }
      ]
    }
    
    ElMessage.success('视频检测完成')
  } catch (error) {
    console.error('视频检测失败:', error)
    ElMessage.error('视频检测失败')
  } finally {
    loading.value = false
  }
}

// 移除视频
const removeVideo = () => {
  videoUrl.value = ''
  videoSize.value = 0
  videoDetectionProgress.value = 0
  verificationResult.value = null
}

const getDetailTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    factCheck: '事实核查',
    sourceAnalysis: '来源分析',
    textAnalysis: '文本分析',
    contentAnalysis: '内容分析',
    credibilityCheck: '可信度评估'
  }
  return typeMap[type] || type
}

const handleExport = () => {
  if (!verificationResult.value) return
  
  try {
    const report = {
      title: verificationResult.value.title,
      content: verificationResult.value.content,
      result: {
        credibility: `${Math.round(verificationResult.value.credibility * 100)}%`,
        summary: verificationResult.value.summary,
        details: verificationResult.value.details.map(detail => ({
          type: getDetailTypeText(detail.type),
          score: `${Math.round(detail.score * 100)}%`,
          explanation: detail.explanation,
          evidence: detail.evidence?.join('、')
        }))
      },
      timestamp: new Date().toLocaleString()
    }
    
    const reportStr = JSON.stringify(report, null, 2)
    const blob = new Blob([reportStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `检测报告_${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('报告导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('报告导出失败')
  }
}

const getRandomStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `-${Math.random() * 20}s`,
    animationDuration: `${20 + Math.random() * 10}s`
  }
}


const generateWordCloudData = (text: string) => {
  const words = text.split(/[\s,.!?;:，。！？；：、]/g)
    .filter(word => word.length > 1)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
  return Object.entries(words)
    .map(([name, value]) => ({ 
      name, 
      value,
      textStyle: {
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50)
}

const initWordCloud = () => {
  if (!wordCloudRef.value) return
  
  if (!wordCloudChart) {
    wordCloudChart = echarts.init(wordCloudRef.value)
  }

  const data = verificationResult.value ? generateWordCloudData(verificationResult.value.content + ' ' + verificationResult.value.title) : []
  const option = {
    series: [{
      data
    }]
  }

  wordCloudChart.setOption(option)
}

const updateWordCloud = () => {
  if (!wordCloudChart || !verificationResult.value) return
  
  const text = verificationResult.value.content + ' ' + verificationResult.value.title
  const data = generateWordCloudData(text)
  
  wordCloudChart.setOption({
    series: [{
      data: data
    }]
  })
}



// 获取进度条颜色

// 获取评分标签类型

// 获取分类文本
const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    technology: '科技',
    society: '社会',
    politics: '政治',
    economy: '经济',
    international: '国际',
    other: '其他'
  }
  return categoryMap[category] || '未知分类'
}

// 获取详情图标
const getDetailIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    factCheck: 'Check',
    sourceAnalysis: 'Link',
    textAnalysis: 'Document',
    contentAnalysis: 'DataAnalysis',
    credibilityCheck: 'Warning'
  }
  return iconMap[type] || 'InfoFilled'
}

// 添加结果卡片的动画类计算

// 添加评分等级的描述文本

// 添加详情卡片的背景渐变

// 在 result-section 中添加伪造分析部分



// 获取分类标签类型
const getCategoryTagType = (category: NewsCategory): 'success' | 'warning' | 'info' | 'danger' | 'primary' | '' => {
  const typeMap: Record<NewsCategory, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    technology: 'success',
    politics: 'danger', 
    economy: 'warning',
    society: 'info',
    international: 'primary',
    other: 'primary'
  }
  return typeMap[category] || ''
}



// 添加可视化数据处理函数

// 在模板中添加分析说明

// 添加文件输入框引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// 处理批量上传点击
const handleBatchUpload = () => {
  fileInputRef.value?.click()
}

// 修改文件处理函数
const handleFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  loading.value = true
  let processedCount = 0

  try {
    // 检查文件类型和大小
    const validFiles = Array.from(files).filter(file => {
      const isValidType = /\.(pdf|doc|docx)$/i.test(file.name)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB

      if (!isValidType) {
        ElMessage.warning(`文件 ${file.name} 格式不支持`)
      }
      if (!isValidSize) {
        ElMessage.warning(`文件 ${file.name} 超过10MB限制`)
      }

      return isValidType && isValidSize
    })

    if (!validFiles.length) {
      ElMessage.error('没有符合要求的文件')
      return
    }

    ElMessage.info(`开始处理 ${validFiles.length} 个文件`)

    // 批量处理文件
    const results = await Promise.all(validFiles.map(async (file) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await newsApi.detectDocument(formData)
        
        processedCount++
        ElMessage.success(`文件 ${file.name} 处理完成 (${processedCount}/${validFiles.length})`)

        return {
          fileName: file.name,
          result: response.data
        }
      } catch (error) {
        console.error(`处理文件 ${file.name} 失败:`, error)
        ElMessage.error(`文件 ${file.name} 处理失败`)
        return null
      }
    }))

    // 过滤掉处理失败的结果
    const successResults = results.filter(result => result !== null)

    if (successResults.length > 0) {
      // 合并所有结果并计算平均分数
      const combinedResult = {
        id: `batch_${Date.now()}`,
        title: `批量文件分析结果 (${successResults.length} 个文件)`,
        content: successResults.map(r => r?.fileName).join('\n'),
        category: 'technology' as NewsCategory,
        credibility: successResults.reduce((acc, curr) => acc + (curr?.result.credibility || 0), 0) / successResults.length,
        source: '文档检测系统',
        verifiedAt: new Date().toISOString(),
        summary: `批量文件分析完成，共处理 ${successResults.length} 个文件`,
        score: successResults.reduce((acc, curr) => acc + (curr?.result.score || 0), 0) / successResults.length,
        sourceScore: successResults.reduce((acc, curr) => acc + ((curr?.result.sourceScore || curr?.result.credibility * 0.9) || 0), 0) / successResults.length,
        sourceEvidence: ['批量文件分析', '多文件交叉验证'],
        textScore: successResults.reduce((acc, curr) => acc + ((curr?.result.textScore || curr?.result.credibility * 0.95) || 0), 0) / successResults.length,
        textEvidence: ['文档内容分析', '多文件语义对比'],
        details: [
          {
            type: 'factCheck',
            score: successResults.reduce((acc, curr) => acc + (curr?.result.credibility || 0), 0) / successResults.length,
            explanation: '批量文件真实性分析',
            evidence: successResults.map(r => `${r?.fileName}: ${((r?.result.credibility || 0) * 100).toFixed(2)}%`)
          },
          {
            type: 'sourceAnalysis',
            score: successResults.reduce((acc, curr) => acc + ((curr?.result.sourceScore || curr?.result.credibility * 0.9) || 0), 0) / successResults.length,
            explanation: '批量文件来源分析',
            evidence: ['多文件来源验证', '文档格式一致性检查']
          },
          {
            type: 'textAnalysis',
            score: successResults.reduce((acc, curr) => acc + ((curr?.result.textScore || curr?.result.credibility * 0.95) || 0), 0) / successResults.length,
            explanation: '批量文件内容分析',
            evidence: ['跨文件语义分析', '内容关联性检查']
          }
        ]
      }

      verificationResult.value = combinedResult as VerificationResult

      // 更新图表和可视化
      nextTick(() => {
        initChart()
        updateVisualizations()
        scrollToResults()
      })

      ElMessage.success(`成功处理 ${successResults.length} 个文件`)
    } else {
      ElMessage.error('所有文件处理失败')
    }

  } catch (error) {
    console.error('批量处理文件失败:', error)
    ElMessage.error('批量处理文件失败')
  } finally {
    loading.value = false
    // 清空文件输入框，允许重复选择相同文件
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

// 添加伪造分析相关函数
const getForgeryLevel = (credibility: number): string => {
  if (credibility < 0.3) return '严重伪造内容'
  if (credibility < 0.5) return '中度伪造内容'
  return '轻度可疑内容'
}

const getForgeryDescription = (credibility: number): string => {
  if (credibility < 0.1) {
    return '该内容几乎可以确定是伪造的，存在明显的伪造特征，建议完全不要采信。常见的伪造手段包括：完全虚假的信息、伪造数据来源、以及故意歪曲事实。伪造内容可能严重误导读者，导致错误决策、资源浪费或社会信任危机。伪造内容通常会利用情绪化语言、捏造的背景资料和虚假的统计数据来误导用户。应立即忽略该内容，避免进一步传播，并从多个权威可靠的来源重新获取信息。'
  }
  if (credibility < 0.2) {
    return '该内容极有可能是伪造的，存在严重的伪造迹象，建议谨慎处理。伪造手段可能包括：数据篡改、伪造来源、虚假引用、或故意夸大事件或人物。伪造内容可能极大误导读者，影响决策的质量和效力，甚至可能造成公共安全问题。伪造内容往往以偏概全、断章取义的方式误导观众。强烈建议避免依赖该信息并重新核实。可以使用反向图像搜索工具、事实核查平台等工具进行验证。'
  }
  if (credibility < 0.3) {
    return '该内容有显著伪造特征，建议完全不要采信。伪造手段可能包括图像篡改（如修改图像元数据）、伪造数据来源（如虚假引用）以及夸大或歪曲事实。伪造内容可能误导读者，影响决策准确性，甚至影响公共舆论的形成。伪造内容可能通过情感化、煽动性语言增强其可信度。请避免使用该内容并从其他可信来源获取信息，确保其真实性。你可以通过核查引用资料、检查发布者背景来确认其可信度。'
  }
  if (credibility < 0.4) {
    return '该内容可能包含部分伪造信息，需要进一步核实。伪造手段可能包括：部分虚假数据、误导性表述，或选择性忽略重要事实，造成信息失真。伪造内容可能影响决策的效果，甚至在某些情况下误导受众形成错误观点。建议通过第三方验证，或查阅更可靠的来源来核实该信息。你可以通过查找该内容的原始出处、对比其他数据来源来核实。'
  }
  if (credibility < 0.6) {
    return '该内容包含一些疑点，可信度较低，存在伪造的可能性。伪造手段可能包括：不准确的统计数据、存在偏差的引述，或来源不明确。伪造内容可能包含部分主观色彩较强的观点，可能影响你对信息的判断。建议核对其他来源，以确认其真实性。通过交叉验证信息、查找权威的学术或官方资料，将有助于增强对该内容的信任度。'
  }
  if (credibility < 0.8) {
    return '该内容存在少量疑点，尽管大部分信息可信，但仍可能存在一些微小的伪造特征，如信息不一致或个别来源不明确。这些特征可能影响内容的整体准确性，但不会完全否定其可信性。建议参考其他可靠来源，进一步核实信息的准确性。你可以查阅相关的最新研究、验证引用的专家资料，或者通过多渠道交叉比对信息。'
  }if(credibility < 0.9) {
  return '该内容有少量疑点，可信度较高，但仍建议从多个可靠来源进行验证。尽管内容本身可信，但可能存在某些细微的伪造特征，如信息不一致、个别来源不明确等。这些疑点可能影响你对该内容的判断，建议谨慎使用。综合验证有助于确保信息的准确性。你可以参考独立的第三方平台或专业领域的权威资源来进一步确认该信息。'
  }
  return '该内容可信度极高，可以采信。经多源交叉验证，各维度指标表现优秀，信息要素完整且符合事实逻辑。建议作为可靠信源使用，同时保持对后续信息更新的关注。'
}


const getForgeryPatterns = (result: VerificationResult) => {
  const patterns: { name: string; icon: string; description: string; evidence: string[] }[] = []
  
  // 根据不同的分析维度添加伪造特征
  if (result.details) {
    result.details.forEach(detail => {
      if (detail.score < 0.6) {
        patterns.push({
          name: getPatternName(detail.type),
          icon: getDetailIcon(detail.type),
          description: detail.explanation,
          evidence: detail.evidence || []
        })
      }
    })
  }
  
  return patterns
}

const getPatternName = (type: string): string => {
  const nameMap: Record<string, string> = {
    factCheck: '事实准确性分析',
    sourceAnalysis: '来源可靠性分析',
    textAnalysis: '内容完整性分析',
    contentAnalysis: '内容分析',
    credibilityCheck: '可信度分析'
  }
  return nameMap[type] || '其他分析'
}

// 在文件顶部添加类型定义
type DetailType = 'factCheck' | 'sourceAnalysis' | 'textAnalysis' | 'contentAnalysis' | 'credibilityCheck'

const getForgeryTips = (result: VerificationResult): string[] => {
  const tips = [
    '交叉对比多个可靠来源的报道',
    '查证新闻中提到的具体时间、地点、人物信息',
    '关注权威媒体和官方机构的辟谣信息',
    '提高警惕，不轻易转发未经证实的信息'
  ]
  
  if (result.details) {
    result.details.forEach(detail => {
      if (detail.score < 0.5) {
        switch (detail.type as DetailType) {
          case 'sourceAnalysis':
            tips.push('注意核实信息发布源的权威性和可靠性')
            break
          case 'textAnalysis':
            tips.push('留意文本中的情感煽动和夸张表述')
            break
          case 'contentAnalysis':
            tips.push('检查内容的逻辑连贯性和细节真实性')
            break
        }
      }
    })
  }
  
  return [...new Set(tips)]
}

const getScoreColor = (score: number) => {
  if (score >= 0.8) return 'var(--el-color-success)'
  if (score >= 0.6) return 'var(--el-color-warning)'
  return 'var(--el-color-danger)'
}

const getScoreLevelText = (score: number) => {
  if (score >= 0.8) return '高度可信'
  if (score >= 0.6) return '基本可信'
  if (score >= 0.4) return '需要核实'
  return '可信度低'
}

const getScoreLevelClass = (score: number) => {
  if (score >= 0.8) return 'level-high'
  if (score >= 0.6) return 'level-medium'
  if (score >= 0.4) return 'level-low'
  return 'level-danger'
}

// 获取评估结果详细说明

// 获取完整检测结果

// 添加结果标签页激活状态
const activeResultTab = ref<string | number>('basic')
</script>

<style scoped>
/* 整体布局优化 */
.verify-layout {
  display: grid;
  grid-template-columns: minmax(360px, 0.8fr) minmax(460px, 1fr);
  gap: 24px;
  margin: 24px auto;
  max-width: 1400px;
  padding: 0 24px;
  align-items: start;
  min-height: calc(100vh - 48px); /* 确保最小高度 */
}

/* 页面头部优化 */
.page-header {
    text-align: center;
  margin: 16px auto 24px;
  max-width: 1200px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(64, 169, 255, 0.06);
  border-radius: 16px;
      margin-bottom: 12px;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--el-text-color-secondary);
  margin: 0 auto;
  max-width: 800px;
  line-height: 1.5;
  letter-spacing: 0.3px;
}

.header-content {
        width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
}

.text-center {
  text-align: center;
  width: 100%;
}

/* 检测控制台优化 */
.verify-card {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.03),
    0 4px 16px rgba(64, 169, 255, 0.05);
  border: 1px solid rgba(64, 169, 255, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 420px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.2px;
}

/* 卡片头部优化 */
.card-header-custom {
  padding: 8px 12px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.02),
    rgba(0, 208, 130, 0.02)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.06);
}

/* 标签页优化 */
.custom-tabs {
  padding: 12px;
}

.el-tabs__item {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
      font-size: 0.85rem;
}

/* 表单区域优化 */
.el-form {
  padding: 0 12px;
  gap: 12px;
}

.el-form-item {
  margin-bottom: 0;
}

/* 结果区域整体布局优化 */
.verify-result {
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 169, 255, 0.3) transparent;
  padding: 24px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.4)
  );
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 12px 48px rgba(64, 169, 255, 0.08);
}

/* 优化滚动条样式 */
.verify-result::-webkit-scrollbar {
  width: 6px;
}

.verify-result::-webkit-scrollbar-track {
  background: transparent;
}

.verify-result::-webkit-scrollbar-thumb {
  background: rgba(64, 169, 255, 0.3);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.verify-result::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 169, 255, 0.5);
}

/* 结果卡片样式优化 */
.result-section {
  height: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 8px 32px rgba(64, 169, 255, 0.1);
  position: relative;
}

/* 结果头部样式优化 */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 12px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

/* 标题样式优化 */
.result-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

/* 标题图标效果优化 */
.title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.title-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center,
    rgba(255, 255, 255, 0.8),
      transparent 70%
    );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.title-icon:hover::after {
  opacity: 1;
}

/* 可信度概览样式优化 */
.credibility-overview {
  padding: 8px; /* 减小内边距 */
  margin-bottom: 8px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.8)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.15);
}

.overview-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px; /* 减小网格间距 */
  align-items: center;
}

/* 评分环形样式优化 */
.score-circle {
  width: 50px; /* 减小环形尺寸 */
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.1),
    rgba(64, 169, 255, 0.05)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1px; /* 减小内部间距 */
  border: 1.5px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 2px 6px rgba(64, 169, 255, 0.1);
}

.score-value {
  font-size: 1.1rem; /* 减小分数字号 */
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-label {
  font-size: 0.7rem; /* 减小标签字号 */
  color: var(--el-text-color-secondary);
}

/* 评分指标样式优化 */
.score-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 减小指标间距 */
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name,
.metric-value {
  font-size: 0.75rem; /* 减小指标字号 */
  color: var(--el-text-color-regular);
}

.metric-bar {
  height: 2px; /* 减小进度条高度 */
  background: rgba(0, 0, 0, 0.04);
  border-radius: 1px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.6s ease-out;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .credibility-overview {
    padding: 6px;
  }

  .overview-main {
    gap: 6px;
  }

  .score-circle {
    width: 45px;
    height: 45px;
  }

  .score-value {
    font-size: 1rem;
  }

  .score-label {
    font-size: 0.65rem;
  }

  .metric-name,
  .metric-value {
    font-size: 0.7rem;
  }

  .metric-bar {
    height: 1.5px;
  }
}

/* 分析模块布局优化 */
.analysis-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px; /* 减小模块间距 */
  margin: 10px 0; /* 减小上下边距 */
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px; /* 减小圆角 */
  padding: 10px; /* 减小内边距 */
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

/* 模块头部样式优化 */
.module-header {
  display: flex;
  align-items: center;
  gap: 8px; /* 减小图标和文字间距 */
  padding: 8px; /* 减小内边距 */
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.module-title {
  font-size: 0.9rem; /* 减小标题字号 */
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* 模块内容样式优化 */
.module-content {
  padding: 8px; /* 减小内边距 */
}

.analysis-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px; /* 减小圆角 */
  padding: 8px; /* 减小内边距 */
  border: 1px solid rgba(64, 169, 255, 0.1);
}

/* 证据列表样式优化 */
.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px; /* 减小标签间距 */
  margin-top: 6px; /* 减小上边距 */
}

.evidence-tag {
  padding: 1px 6px; /* 减小标签内边距 */
  background: rgba(64, 169, 255, 0.08);
  border-radius: 8px;
  font-size: 0.75rem; /* 减小字号 */
  color: var(--el-text-color-regular);
  border: 1px solid rgba(64, 169, 255, 0.15);
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .analysis-modules {
    gap: 8px; /* 移动端进一步减小间距 */
  }

  .analysis-module {
    padding: 8px;
  }

  .module-header {
    padding: 6px;
  }

  .module-title {
    font-size: 0.85rem;
  }

  .evidence-tag {
    font-size: 0.7rem;
    padding: 1px 4px;
  }
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px; /* 减小圆角 */
  padding: 10px; /* 减小内边距 */
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.analysis-module:nth-child(1) { animation-delay: 0.1s; }
.analysis-module:nth-child(2) { animation-delay: 0.2s; }
.analysis-module:nth-child(3) { animation-delay: 0.3s; }

/* 移动端适配 */
@media (max-width: 768px) {
  .verify-result {
    position: relative;
    top: 0;
    height: auto;
    padding: 16px;
  }

  .result-section {
    padding: 20px;
    gap: 20px;
  }

  .title-content h2 {
    font-size: 1.4rem;
  }

  .analysis-modules {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .analysis-module {
    padding: 12px;
  }

  .evidence-tag {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .result-section {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .title-content h2 {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.9),
      var(--el-color-primary)
    );
    -webkit-background-clip: text;
  }

  .analysis-module {
    background: rgba(255, 255, 255, 0.05);
  }

  .credibility-overview::before {
    background: radial-gradient(
      circle at top right,
      rgba(64, 169, 255, 0.15),
      transparent 70%
    );
  }
}

/* 卡片底部优化 */
.card-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(64, 169, 255, 0.06);
  background: rgba(255, 255, 255, 0.5);
}

.footer-tip {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 上传区域优化 */
.upload-area {
  padding: 16px;
  min-height: 140px;
  border: 1px dashed rgba(64, 169, 255, 0.15);
  border-radius: 6px;
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 0.85rem;
}

.upload-hint {
  font-size: 0.75rem;
  margin-top: 4px;
}

/* 响应式布局优化 */
@media (max-width: 1200px) {
  .verify-layout {
    grid-template-columns: minmax(300px, 1fr) minmax(400px, 1fr);
    gap: 16px;
  }
}

@media (max-width: 992px) {
  .verify-layout {
    grid-template-columns: 1fr;
  }
  
  .verify-main {
    position: relative;
    top: 0;
    height: auto;
    min-height: 580px;
  }
}

@media (max-width: 768px) {
  .verify-layout {
    padding: 0 12px;
    margin: 12px auto;
  }
  
  .verify-main {
    min-height: 520px;
  }
  
  .custom-tabs,
  .el-form,
  .form-actions {
    padding: 10px;
  }
  
  .verify-btn,
  .clear-btn {
        height: 36px;
    font-size: 0.85rem;
  }
}
.verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.3);
}

.verify-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 169, 255, 0.25);
}

.verify-btn .el-icon {
  font-size: 1.1em;
  margin-right: 8px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}
.clear-btn:hover {
  border-color: var(--el-color-primary);
          color: var(--el-color-primary);
  background: rgba(64, 169, 255, 0.05);
  transform: translateY(-2px);
}

.clear-btn:active {
  transform: translateY(-1px);
}

.clear-btn .el-icon {
  font-size: 1.1em;
  margin-right: 6px;
}

/* 按钮动画效果 */
.verify-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .form-actions {
    border-top-color: rgba(255, 255, 255, 0.06);
  }

  .clear-btn {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }

  .clear-btn:hover {
    background: rgba(64, 169, 255, 0.1);
    border-color: var(--el-color-primary);
            color: var(--el-color-primary);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .form-actions {
    padding: 10px 12px;
    gap: 10px;
    margin-top: 10px;
  }

  .verify-btn,
  .clear-btn {
    height: 38px;
      font-size: 0.9rem;
  }

  .verify-btn {
    padding: 0 20px;
  }

  .clear-btn {
    padding: 0 16px;
  }
}

/* 卡片底部优化 */
.card-footer {
  padding: 12px 16px;
  margin-top: auto;
}

.footer-tip {
  font-size: 0.85rem;
}

/* 样例按钮优化 */
.sample-btn {
  padding: 6px 12px;
  font-size: 0.9rem;
}

/* 移动端适配优化 */
@media (max-width: 992px) {
  .verify-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .verify-main {
    position: relative;
    top: 0;
    height: auto;
    min-height: 600px;
  }
}

@media (max-width: 768px) {
  .verify-layout {
    margin: 12px auto;
    padding: 0 12px;
  }

  .verify-main {
    min-height: 500px;
  }

  .card-header-custom {
    padding: 12px 16px;
  }

  .icon-wrapper {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }

  .header-title {
    font-size: 1rem;
  }

  .custom-tabs {
    padding: 12px;
  }

  .el-tabs__item {
    height: 38px;
    padding: 0 16px;
    font-size: 0.9rem;
  }

  .el-form {
    padding: 12px;
  }

  .el-form-item {
      margin-bottom: 12px;
  }

  .form-actions {
    padding: 12px;
  }

  .verify-btn,
  .clear-btn {
    height: 36px;
      font-size: 0.9rem;
  }

  .card-footer {
    padding: 10px 12px;
  }
}

/* 滚动条优化 */
.el-form {
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 169, 255, 0.2) transparent;
}

.el-form::-webkit-scrollbar {
  width: 4px;
}

.el-form::-webkit-scrollbar-track {
  background: transparent;
}

.el-form::-webkit-scrollbar-thumb {
  background-color: rgba(64, 169, 255, 0.2);
  border-radius: 2px;
}

.el-form::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 169, 255, 0.3);
}

.el-input__inner,
.el-textarea__inner {
  border-radius: 8px;
  border: 1px solid rgba(64, 169, 255, 0.2);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.el-input__inner:hover,
.el-textarea__inner:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px rgba(64, 169, 255, 0.1);
}

/* 按钮样式优化 */
.verify-btn {
  background: linear-gradient(135deg, 
    var(--el-color-primary), 
    var(--el-color-success)
  );
  border: none;
  position: relative;
  overflow: hidden;
}

.verify-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* 结果区域优化 */
.result-header {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.98),
    rgba(255, 255, 255, 0.95)
  );
}

.overview-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  border: 1px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.analysis-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  border: 1px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(64, 169, 255, 0.1);
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .verify-card,
  .result-section {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .result-header {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.9),
      rgba(0, 0, 0, 0.85)
    );
  }

  .overview-card,
  .analysis-card {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05)
    );
    border-color: rgba(255, 255, 255, 0.1);
  }

  .el-input__inner,
  .el-textarea__inner {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 检测控制台优化 */
.verify-main {
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  transition: all var(--animation-duration) var(--transition-bezier);
}

.verify-card {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 8px 32px rgba(64, 169, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(64, 169, 255, 0.15);
  overflow: hidden;
  display: flex;
        flex-direction: column;
  gap: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.verify-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.08),
    0 12px 40px rgba(64, 169, 255, 0.12);
}

/* 卡片头部现代化 */
.card-header-custom {
  padding: 14px 16px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.05),
    rgba(0, 208, 130, 0.05)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
  position: relative;
}

.card-header-custom::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(64, 169, 255, 0.2),
    transparent
  );
}

/* 图标容器现代化 */
.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  position: relative;
  overflow: hidden;
}

.icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.2),
    transparent 70%
  );
  animation: rotate 8s linear infinite;
}

/* 标签页现代化 */
.custom-tabs {
  padding: 12px 14px;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.3)
  );
}

.el-tabs__nav-wrap {
  margin: 0;
  padding: 3px;
  background: rgba(64, 169, 255, 0.05);
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.el-tabs__item {
  height: 38px;
  padding: 0 16px;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-tabs__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.1),
    rgba(0, 208, 130, 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.el-tabs__item:hover::before {
  opacity: 1;
}

.el-tabs__item.is-active {
  background: white;
  color: var(--el-color-primary);
  font-weight: 600;
  box-shadow: 
    0 2px 6px rgba(64, 169, 255, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

/* 表单控件现代化 */
.el-input__inner,
.el-textarea__inner {
  padding: 10px 14px;
  font-size: 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(64, 169, 255, 0.2);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.02),
    0 1px 2px rgba(255, 255, 255, 0.1);
}

.el-input__inner:hover,
.el-textarea__inner:hover {
  border-color: var(--el-color-primary);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.02),
    0 0 0 3px rgba(64, 169, 255, 0.1);
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: var(--el-color-primary);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.02),
    0 0 0 3px rgba(64, 169, 255, 0.15);
}

/* 按钮现代化 */
.verify-btn {
  height: 38px;
  font-size: 0.9rem;
  padding: 0 18px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  border: none;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.verify-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

.verify-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.3);
}

.clear-btn {
  height: 38px;
  font-size: 0.9rem;
  padding: 0 18px;
  border: 1px solid rgba(64, 169, 255, 0.2);
  background: transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  border-color: var(--el-color-primary);
  background: rgba(64, 169, 255, 0.05);
  transform: translateY(-1px);
}

/* 动画效果 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .verify-card {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .custom-tabs {
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.02)
    );
  }

  .el-tabs__item.is-active {
    background: rgba(64, 169, 255, 0.15);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.2),
      0 1px 3px rgba(64, 169, 255, 0.1);
  }

  .el-input__inner,
  .el-textarea__inner {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .clear-btn {
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }

  .clear-btn:hover {
    border-color: var(--el-color-primary);
    background: rgba(64, 169, 255, 0.1);
    color: var(--el-color-primary);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .verify-main {
    height: auto;
  }

  .el-tabs__item {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 0.95rem;
  }

  .verify-btn,
  .clear-btn {
    height: 40px;
    font-size: 0.95rem;
  }
}

/* 卡片内容间距优化 */
.step-item {
  padding: clamp(16px, 2vh, 24px) clamp(20px, 2vw, 28px);
}

/* 文本阴影效果 */
.empty-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标签悬浮效果优化 */
.step-tags .el-tag {
  transition: all 0.3s ease;
}

.step-tags .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.verify-news {
  min-height: 100vh;
  padding: 40px 0;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  mix-blend-mode: soft-light;
}

.circle-1 {
  top: -10%;
  left: -10%;
  width: 40%;
  height: 40%;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.2), rgba(0, 208, 130, 0.2));
  animation: float 20s infinite alternate;
}

.circle-2 {
  bottom: -15%;
  right: -15%;
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, rgba(230, 162, 60, 0.2), rgba(245, 108, 108, 0.2));
  animation: float 25s infinite alternate-reverse;
}

.circle-3 {
  top: 40%;
  left: 60%;
  width: 30%;
  height: 30%;
  background: linear-gradient(45deg, rgba(144, 147, 153, 0.2), rgba(103, 194, 58, 0.2));
  animation: float 18s infinite alternate;
}

.circle-4 {
  top: 20%;
  right: 30%;
  width: 25%;
  height: 25%;
  background: linear-gradient(45deg, rgba(103, 58, 194, 0.2), rgba(58, 194, 103, 0.2));
  animation: float 22s infinite alternate-reverse;
}

.floating-shapes .shape {
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  animation: floatShape 20s infinite linear both;
  transform-origin: center;
}

.shape-1 { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.shape-2 { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
.shape-3 { clip-path: circle(50% at 50% 50%); }
.shape-4 { clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%); }

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, 30px) rotate(8deg); }
  100% { transform: translate(-30px, -30px) rotate(-8deg); }
}

@keyframes floatShape {
  0% { 
    transform: translate(0, 0) rotate(0deg) scale(1); 
    opacity: 0;
  }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { 
    transform: translate(100vw, 100vh) rotate(360deg) scale(0.5);
    opacity: 0;
  }
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(64, 158, 255, 0.1);
  color: var(--el-color-primary);
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 24px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
  margin: 0 0 32px;
}

.feature-tags .el-tag {
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.feature-tags .el-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, 20px) rotate(5deg); }
  100% { transform: translate(-20px, -20px) rotate(-5deg); }
}

@keyframes floatShape {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(100vw, 100vh) rotate(360deg); }
}

.content-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.feature-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 24px 0;
}

.feature-tags .el-tag {
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.feature-tags .el-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.main-content {
  position: relative;
  z-index: 1;
}

.verify-card,
.result-card {
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 4px;
}

.custom-tabs :deep(.el-tabs__nav) {
  border: none !important;
}

.custom-tabs :deep(.el-tabs__item) {
  height: 44px;
  line-height: 44px;
  padding: 0 20px;
  font-size: 1.2rem;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 500;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 700;
  color: var(--el-color-primary);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.custom-tabs :deep(.el-tabs__item:not(.is-active):hover) {
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
}

.custom-tabs :deep(.el-tabs__item .tab-label) {
  position: relative;
  z-index: 1;
}

.custom-tabs :deep(.el-tabs__item.is-active .tab-label) {
  background: linear-gradient(120deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  color: transparent;
}

@media (max-width: 768px) {
  .custom-tabs :deep(.el-tabs__item) {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 1.1rem;
  }

  .tab-label {
    font-size: 1.1rem;
    padding: 0 4px;
  }

  .tab-label .el-icon {
    font-size: 1.2rem;
  }
}

.metric-item {
  background: var(--el-bg-color-page);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.metric-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.detail-metrics {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .content-container {
    padding: 0 20px;
  }

  .detail-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .verify-news {
    padding: 20px 0;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .feature-tags {
    flex-wrap: wrap;
    justify-content: center;
  }

  .detail-metrics {
    grid-template-columns: 1fr;
  }

  .verify-card,
  .result-card {
    margin-bottom: 20px;
  }
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  background: linear-gradient(45deg, var(--el-color-primary-light-8), var(--el-color-success-light-8));
  border-radius: 50%;
  opacity: 0.3;
  animation: float 15s infinite linear;
}

.floating-circle:nth-child(1) { width: 300px; height: 300px; top: 10%; left: 10%; animation-delay: 0s; }
.floating-circle:nth-child(2) { width: 200px; height: 200px; top: 60%; left: 80%; animation-delay: -3s; }
.floating-circle:nth-child(3) { width: 150px; height: 150px; top: 30%; left: 60%; animation-delay: -6s; }
.floating-circle:nth-child(4) { width: 250px; height: 250px; top: 70%; left: 20%; animation-delay: -9s; }
.floating-circle:nth-child(5) { width: 180px; height: 180px; top: 40%; left: 30%; animation-delay: -12s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(100px, 100px) rotate(360deg); }
}

.gradient-text {
  background: linear-gradient(135deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left span {
  font-size: 1.4rem;
  font-weight: 600;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.empty-state {
  height: 100%;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85)
  );
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(64, 169, 255, 0.08),
    0 2px 8px rgba(64, 169, 255, 0.05);
  border: 1px solid rgba(64, 169, 255, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%,
      rgba(64, 169, 255, 0.1),
      transparent 70%
    );
  }
  
  .empty-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    align-items: center;
  }
  
  .empty-header {
    text-align: center;
    
    .empty-icon-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .empty-icon {
        font-size: 44px;
        color: var(--el-color-primary);
        animation: float 4s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(64, 169, 255, 0.3));
      }
      
      .icon-pulse {
        position: absolute;
        inset: 10%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(64, 169, 255, 0.2),
          rgba(64, 169, 255, 0.1)
        );
        animation: pulse 3s ease-in-out infinite;
      }
      
      .icon-ring {
        position: absolute;
        inset: -12px;
        border: 2px dashed var(--el-color-primary);
        border-radius: 50%;
        opacity: 0.25;
        animation: spin 15s linear infinite;
      }
    }
    
    .empty-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1.2rem;
      background: linear-gradient(135deg, 
        var(--el-color-primary), 
        #36cfc9 60%,
        var(--el-color-success)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.5px;
      line-height: 1.4;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-desc {
      font-size: 1.2rem;
      color: var(--el-text-color-secondary);
      letter-spacing: 0.3px;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .empty-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    width: 100%;
    padding: 1.5rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 45px;
      left: 12%;
      right: 12%;
      height: 3px;
      background: linear-gradient(90deg,
        rgba(64, 169, 255, 0.1),
        rgba(64, 169, 255, 0.3),
        rgba(64, 169, 255, 0.1)
      );
      border-radius: 1.5px;
      z-index: 0;
    }
  }

  .step-item {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    border: 1px solid rgba(64, 169, 255, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 12px 32px rgba(64, 169, 255, 0.15),
        0 4px 8px rgba(64, 169, 255, 0.1);
      border-color: rgba(64, 169, 255, 0.4);
      background: rgba(255, 255, 255, 0.8);

      .step-icon {
        transform: scale(1.1);
        
        .el-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(64, 169, 255, 0.4));
        }
      }
    }

    .step-icon {
      position: relative;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg,
        rgba(64, 169, 255, 0.15),
        rgba(64, 169, 255, 0.25)
      );
      transition: all 0.4s ease;
      
      .step-number {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--el-color-primary);
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(64, 169, 255, 0.3);
      }

      .el-icon {
        font-size: 32px;
        color: var(--el-color-primary);
        filter: drop-shadow(0 3px 6px rgba(64, 169, 255, 0.3));
        transition: all 0.4s ease;
      }

      .icon-bg {
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(64, 169, 255, 0.2);
        animation: spin 12s linear infinite;
      }
    }

    .step-info {
      text-align: center;

      .step-title {
        display: block;
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--el-text-color-primary);
        letter-spacing: 0.3px;
      }

      .step-desc {
        color: var(--el-text-color-secondary);
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .step-tags {
        display: flex;
        gap: 0.8rem;
        justify-content: center;
        margin-top: 1rem;

        .el-tag {
          padding: 0 16px;
          height: 32px;
          border-radius: 16px;
          font-weight: 500;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.4; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .empty-state {
    padding: 1.5rem;
    min-height: 500px;

    .empty-header {
      .empty-icon-wrapper {
        width: 60px;
        height: 60px;
        
        .empty-icon {
          font-size: 28px;
        }
      }

      .empty-title {
        font-size: 1.4rem;
    }
    
    .empty-desc {
        font-size: 1rem;
      }
    }

    .empty-steps {
      grid-template-columns: 1fr;
      gap: 1rem;
      
      &::before {
        display: none;
      }
    }

    .step-item {
      padding: 1rem;
      
      .step-icon {
        width: 48px;
        height: 48px;
        
        .el-icon {
          font-size: 24px;
        }
      }

      .step-info {
        .step-title {
          font-size: 1rem;
        }

        .step-desc {
          font-size: 0.9rem;
        }
      }
    }
  }
}

.credibility-overview {
  margin: 20px 0;
  padding: 0;
}

.overview-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(64, 169, 255, 0.15);
  border-radius: 12px;
}

.score-ring {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.ring-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-unit {
  font-size: 16px;
  margin-left: 2px;
}

.score-label {
  font-size: 14px;
      color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.overview-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

/* 分析网格优化 */
.analysis-grid {
    display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  margin: 20px 0;
  padding: 0;
}

.analysis-card {
  padding: 16px;
  min-height: 180px;
}

.card-header {
  margin-bottom: 12px;
}

.header-title {
  font-size: 14px;
}

.progress-bar {
  height: 6px;
  margin: 12px 0;
}

.explanation {
  font-size: 13px;
  margin: 8px 0;
}

.evidence-list {
  margin-top: 12px;
  gap: 6px;
}

.evidence-tag {
  font-size: 12px;
  padding: 2px 8px;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .overview-card {
    flex-direction: column;
    padding: 16px;
    text-align: center;
  }

  .score-ring {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }

  .score-value {
    font-size: 24px;
  }

  .score-unit {
    font-size: 14px;
  }

  .overview-text {
    margin-top: 12px;
    font-size: 13px;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .analysis-card {
    padding: 12px;
    min-height: 160px;
  }
}

/* 动画优化 */
.analysis-card {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.analysis-card:nth-child(1) { animation-delay: 0.1s; }
.analysis-card:nth-child(2) { animation-delay: 0.2s; }
.analysis-card:nth-child(3) { animation-delay: 0.3s; }

.credibility-ring {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
}

.credibility-ring svg {
  transform: rotate(-90deg);
  overflow: visible;
}

.progress-ring {
  transition: stroke-dashoffset 1s ease-in-out;
  filter: drop-shadow(0 0 8px rgba(64, 169, 255, 0.3));
}

.ring-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}

.credibility-details {
  margin-top: 32px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 8px;
}

.detail-progress {
  display: flex;
  align-items: center;
    gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

.progress-value {
  font-size: 14px;
  color: var(--el-text-color-regular);
  min-width: 45px;
  text-align: right;
}

.overview-card {
  padding: 32px;
  width: 100%;
  max-width: 600px;
}

@media (max-width: 768px) {
  .credibility-ring {
    width: 160px;
    height: 160px;
  }

  .overview-value {
    font-size: 36px;
  }

  .value-unit {
    font-size: 20px;
  }

  .overview-card {
    padding: 24px;
  }
}

.credibility-content {
  padding: 20px;
  height: 360px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.credibility-ring {
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.credibility-details {
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
}

.detail-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
      padding: 12px;
  margin-bottom: 12px;
}

.detail-label {
  font-weight: 500;
  margin-bottom: 8px;
}

.detail-explanation {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.progress-bar {
  height: 6px;
}

/* 自定义滚动条样式 */
.credibility-details::-webkit-scrollbar {
  width: 6px;
}

.credibility-details::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.credibility-details::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 169, 255, 0.5);
}

@media (max-width: 768px) {
  .credibility-content {
    height: auto;
    min-height: 300px;
  }

  .credibility-ring {
    width: 120px;
    height: 120px;
  }

  .overview-value {
    font-size: 32px;
  }

  .value-unit {
    font-size: 16px;
  }
}

.result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}

.result-meta .el-icon {
  margin-right: 4px;
  font-size: 16px;
}

.result-source,
.result-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-category {
  background: rgba(64, 169, 255, 0.15);
  color: rgb(64, 169, 255);
  border: 1px solid rgba(64, 169, 255, 0.3);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.summary-score {
  font-size: 16px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(64, 169, 255, 0.15);
  border: 1px solid rgba(64, 169, 255, 0.3);
  color: rgb(64, 169, 255);
}

@media (max-width: 768px) {
  .result-meta {
    gap: 12px;
    margin-top: 12px;
  }
  
  .result-title h2 {
    font-size: 20px;
  }
}

.result-summary {
  margin: 24px 0;
}

.summary-card {
  padding: 20px;
  border-radius: 12px;
  background: rgba(20, 40, 80, 0.5);
  backdrop-filter: blur(10px);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.analysis-card {
  height: 100%;
  padding: 20px;
  border-radius: 12px;
  background: rgba(20, 40, 80, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.analysis-card:hover {
  background: rgba(20, 40, 80, 0.7);
  border-color: rgba(64, 169, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.score-tag {
  font-weight: 500;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explanation {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(64, 169, 255, 0.15);
}

@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .summary-score {
    align-self: flex-end;
  }
}

/* 标题和文本样式优化 */
.result-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  letter-spacing: 0.5px;
}

.result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.3px;
}

.result-category {
  background: rgba(64, 169, 255, 0.15);
  color: rgb(64, 169, 255);
  border: 1px solid rgba(64, 169, 255, 0.3);
  padding: 4px 12px;
      border-radius: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-size: 13px;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.9);
}

.summary-score {
  font-size: 15px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 8px;
  letter-spacing: 0.5px;
}

.summary-text {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 0.2px;
}

.header-title {
        display: flex;
        align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;
}

.explanation {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 0.2px;
}

.evidence-tag {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2px;
        background: rgba(64, 169, 255, 0.1);
  border: 1px solid rgba(64, 169, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
}

.score-tag {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .result-title h2 {
    font-size: 20px;
  }

  .result-meta {
    font-size: 12px;
    gap: 12px;
    margin-top: 8px;
  }

  .summary-title,
  .header-title {
    font-size: 14px;
  }

  .summary-text,
  .explanation {
    font-size: 13px;
  }

  .evidence-tag {
    font-size: 11px;
  }
}

/* 添加平滑过渡 */
.result-section * {
  transition: all 0.3s ease;
}

/* 结果区域整体样式 */
.result-section {
  position: relative;
  padding: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 8px 32px rgba(64, 169, 255, 0.1);
  backdrop-filter: blur(12px);
}

/* 发光边框效果 */
.result-section::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg,
    rgba(64, 169, 255, 0.1),
    rgba(0, 217, 255, 0.15),
    rgba(64, 169, 255, 0.1)
  );
  border-radius: 14px;
  z-index: -1;
}

/* 卡片样式统一 */
.summary-card,
.analysis-card,
.chart-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(64, 169, 255, 0.15);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 标签和进度条样式 */
.result-category {
  background: rgba(64, 169, 255, 0.1);
  color: rgb(64, 169, 255);
  border: 1px solid rgba(64, 169, 255, 0.2);
}

.evidence-tag {
  background: rgba(64, 169, 255, 0.05);
  border: 1px solid rgba(64, 169, 255, 0.15);
  color: rgba(0, 0, 0, 0.7);
}

.progress-bar {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.progress-fill {
  background: linear-gradient(90deg,
    rgba(64, 169, 255, 0.9),
    rgba(0, 217, 255, 1)
  );
}

/* 文字颜色优化 */
.result-title h2 {
  color: rgba(0, 0, 0, 0.85);
}

.summary-title,
.header-title {
  color: rgba(0, 0, 0, 0.85);
}

.summary-text,
.explanation {
  color: rgba(0, 0, 0, 0.7);
}

.result-meta {
  color: rgba(0, 0, 0, 0.5);
}

/* 分割颜色 */
.evidence-list {
  border-top: 1px solid rgba(64, 169, 255, 0.1);
}

/* 悬浮效果 */
.analysis-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(64, 169, 255, 0.25);
  box-shadow: 0 8px 24px rgba(64, 169, 255, 0.15);
}

/* 分数标签 */
.summary-score {
  background: rgba(64, 169, 255, 0.1);
  border: 1px solid rgba(64, 169, 255, 0.2);
  color: rgb(64, 169, 255);
}

/* 图表容器 */
.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(64, 169, 255, 0.1);
}

/* 图标颜色 */
        .el-icon {
  color: rgb(64, 169, 255);
}

/* 卡片内容 */
.card-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
}

/* 布局优化 */
.main-content {
  display: flex;
  gap: 24px;
}

/* 结果区域整体布局 */
.result-section {
  position: sticky;
  top: 24px;
  padding: 24px;
  border-radius: 16px;
  height: calc(100vh - 180px);
  display: flex;
        color: var(--el-text-color-primary);
      }
      
/* 标签页终极简化 */
.custom-tabs {
  padding: 3px 4px;
}

.el-tabs__header {
  margin: 0 0 4px 0;
  padding: 1px;
}

.el-tabs__item {
  height: 24px;
  line-height: 24px;
  padding: 0 6px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1px;
}

/* 表单区域终极简化 */
.el-form {
  padding: 4px;
  gap: 3px;
}

.el-form-item {
  margin-bottom: 3px;
}

.el-input__inner,
.el-textarea__inner {
  padding: 3px 6px;
        font-size: 0.75rem;
  border-radius: 3px;
  border: 1px solid rgba(64, 169, 255, 0.08);
}

.el-textarea__inner {
  min-height: 50px;
  max-height: 120px;
}

/* 检测说明区域终极简化 */
.detection-guide {
  padding: 6px;
  margin-bottom: 6px;
  border-radius: 3px;
  background: rgba(64, 169, 255, 0.015);
}

.guide-header {
  margin-bottom: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: var(--el-color-primary);
}

.guide-content {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--el-text-color-regular);
}

.feature-list li {
  font-size: 0.75rem;
  line-height: 1.4;
  letter-spacing: 0.1px;
}

/* 操作按钮区域终极简化 */
.form-actions {
  padding: 4px 6px;
  gap: 4px;
  margin-top: 3px;
  border-top: 1px solid rgba(64, 169, 255, 0.04);
  }

  .verify-btn,
  .clear-btn {
  height: 26px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* 底部提示终极简化 */
.card-footer {
  padding: 3px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(64, 169, 255, 0.04);
}

.footer-tip {
  font-size: 0.65rem;
  opacity: 0.6;
  line-height: 1.4;
  letter-spacing: 0.1px;
        color: var(--el-text-color-secondary);
}

/* 移动端终极优化 */
@media (max-width: 768px) {
  .verify-card {
    min-height: 380px;
  }

  .card-header-custom {
    padding: 3px 4px;
}

.icon-wrapper {
    width: 20px;
    height: 20px;
    font-size: 11px;
}

.el-tabs__item {
    height: 22px;
    line-height: 22px;
    padding: 0 4px;
  }
  
.form-actions {
    padding: 3px 4px;
}

.verify-btn,
.clear-btn {
    height: 24px;
  font-size: 0.7rem;
    padding: 0 6px;
  }
}

/* 操作按钮区域优化 */
.form-actions {
  padding: 16px;
  gap: 16px;
  margin-top: 16px;
  border-top: 1px solid rgba(64, 169, 255, 0.08);
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0 0 12px 12px;
}

/* 检测按钮样式 */
.verify-btn {
  flex: 2;
  height: 44px; /* 增加按钮高度 */
  font-size: 1rem; /* 增大字体 */
            font-weight: 600;
  padding: 0 28px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  border: none;
  border-radius: 10px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(64, 169, 255, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(64, 169, 255, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 清空按钮样式 */
.clear-btn {
  flex: 1;
  height: 44px; /* 增加按钮高度 */
  font-size: 1rem; /* 增大字体 */
  font-weight: 600;
  padding: 0 24px;
  border: 2px solid rgba(64, 169, 255, 0.15);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  color: var(--el-text-color-regular);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.clear-btn:hover {
  border-color: var(--el-color-primary);
            color: var(--el-color-primary);
  background: rgba(64, 169, 255, 0.05);
  transform: translateY(-2px);
}

/* 按钮内容布局 */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
}

/* 按钮图标样式 */
.verify-btn .el-icon,
.clear-btn .el-icon {
  font-size: 1.3em; /* 增大图标 */
  transition: transform 0.3s ease;
}

.verify-btn:hover .el-icon,
.clear-btn:hover .el-icon {
  transform: scale(1.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .form-actions {
    padding: 12px;
    gap: 12px;
  }
  
  .verify-btn,
  .clear-btn {
    height: 40px; /* 移动端稍微减小高度 */
    font-size: 0.95rem;
  }
  
  .verify-btn {
    padding: 0 24px;
  }
  
  .clear-btn {
    padding: 0 20px;
  }
  
  .btn-content {
    gap: 8px;
  }
  
  .verify-btn .el-icon,
  .clear-btn .el-icon {
    font-size: 1.2em;
  }
}

/* 图片检测区域布局 */
.image-verify {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 169, 255, 0.1);
}

/* 检测进度指示器 */
.detection-progress {
  position: relative;
  height: 4px;
  background: rgba(64, 169, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, 
    var(--el-color-primary), 
    var(--el-color-success)
  );
  animation: progressAnimation 2s ease infinite;
}

/* 检测结果区域背景优化 */
.verify-result {
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 169, 255, 0.3) transparent;
  padding: 24px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.4)
  );
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 12px 48px rgba(64, 169, 255, 0.08);
}

/* 结果区块样式优化 */
.result-section {
  height: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 8px 32px rgba(64, 169, 255, 0.1);
  position: relative;
}

/* 添加装饰性背景 */
.result-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(
      circle at top right,
      rgba(64, 169, 255, 0.1),
      transparent 70%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(103, 194, 58, 0.1),
      transparent 70%
    );
  z-index: -1;
}

/* 添加网格背景 */
.result-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(64, 169, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 169, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
  opacity: 0.5;
}

/* 结果卡片悬浮效果 */
.result-section:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 36px rgba(64, 169, 255, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 滚动条样式优化 */
.verify-result::-webkit-scrollbar {
  width: 6px;
}

.verify-result::-webkit-scrollbar-track {
  background: transparent;
}

.verify-result::-webkit-scrollbar-thumb {
  background: rgba(64, 169, 255, 0.3);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.verify-result::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 169, 255, 0.5);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .verify-result {
    background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.5)
    );
    border-color: rgba(255, 255, 255, 0.1);
  }

  .result-section {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .result-section::before {
    background: 
      radial-gradient(
        circle at top right,
        rgba(64, 169, 255, 0.15),
        transparent 70%
      ),
      radial-gradient(
        circle at bottom left,
        rgba(103, 194, 58, 0.15),
        transparent 70%
      );
  }

  .result-section::after {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .verify-result {
    position: relative;
    top: 0;
    height: auto;
    padding: 16px;
  }

  .result-section {
    padding: 20px;
    gap: 20px;
  }

  .result-section::after {
    background-size: 16px 16px;
  }
}

/* 添加动画效果 */
.result-section {
  animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 添加浮动装饰元素 */
.result-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
}

.floating-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(64, 169, 255, 0.3);
  animation: float 20s infinite linear;
}

.floating-dot:nth-child(1) { top: 10%; left: 10%; animation-delay: -5s; }
.floating-dot:nth-child(2) { top: 20%; right: 20%; animation-delay: -10s; }
.floating-dot:nth-child(3) { bottom: 30%; left: 30%; animation-delay: -15s; }

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(100px, 100px); }
}

/* 结果头部样式优化 */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 12px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.result-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.title-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.2), rgba(0, 208, 130, 0.2));
  animation: float 20s infinite alternate;
}

@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}

.title-icon:hover::before {
  opacity: 1;
}

.title-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

/* 可信度概览区域优化 */
.credibility-overview {
  padding: 8px; /* 减小内边距 */
  margin-bottom: 8px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.8)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.15);
}

.overview-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px; /* 减小网格间距 */
  align-items: center;
}

/* 评分环形样式优化 */
.score-circle {
  width: 50px; /* 减小环形尺寸 */
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.1),
    rgba(64, 169, 255, 0.05)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1px; /* 减小内部间距 */
  border: 1.5px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 2px 6px rgba(64, 169, 255, 0.1);
}

.score-value {
  font-size: 1.1rem; /* 减小分数字号 */
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-label {
  font-size: 0.7rem; /* 减小标签字号 */
  color: var(--el-text-color-secondary);
}

/* 评分指标样式优化 */
.score-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 减小指标间距 */
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name,
.metric-value {
  font-size: 0.75rem; /* 减小指标字号 */
  color: var(--el-text-color-regular);
}

.metric-bar {
  height: 2px; /* 减小进度条高度 */
  background: rgba(0, 0, 0, 0.04);
  border-radius: 1px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.6s ease-out;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .credibility-overview {
    padding: 6px;
  }

  .overview-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .score-circle {
    width: 45px;
    height: 45px;
  }

  .score-value {
    font-size: 1rem;
  }

  .score-label {
    font-size: 0.65rem;
  }

  .metric-name,
  .metric-value {
    font-size: 0.7rem;
  }

  .metric-bar {
    height: 1.5px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .credibility-overview {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.03)
    );
  }

  .metric-bar {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 分析模块网格布局优化 */
.analysis-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.analysis-module:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(64, 169, 255, 0.12);
}

/* 分析模块内容样式优化 */
.module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.module-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-content {
  padding: 8px;
}

.analysis-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.1);
}

.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.evidence-tag {
  padding: 1px 6px;
  background: rgba(64, 169, 255, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: var(--el-text-color-regular);
  border: 1px solid rgba(64, 169, 255, 0.15);
  transition: all 0.3s ease;
}

.evidence-tag:hover {
  background: rgba(64, 169, 255, 0.12);
  transform: translateY(-1px);
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .verify-result {
    height: auto;
    position: relative;
    top: 0;
  }

  .result-section {
    padding: 16px;
    gap: 12px;
  }

  .overview-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .analysis-modules {
    grid-template-columns: 1fr;
  }

  .title-content h2 {
    font-size: 1.3rem;
  }

  .analysis-module {
    padding: 10px;
  }

  .evidence-tag {
    font-size: 0.75rem;
    padding: 1px 6px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .result-section {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .analysis-module {
    background: rgba(255, 255, 255, 0.05);
  }

  .analysis-item {
    background: rgba(255, 255, 255, 0.03);
  }

  .evidence-tag {
    background: rgba(64, 169, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.video-verify {
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}

.upload-area.video-upload {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgba(64, 169, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.upload-area.video-upload:hover {
  border-color: var(--el-color-primary);
  background: rgba(64, 169, 255, 0.02);
}

.upload-content {
  text-align: center;
  padding: 32px;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.upload-text h3 {
  font-size: 1.2rem;
  margin: 0 0 8px;
  color: var(--el-text-color-primary);
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.supported-formats {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.format-tag {
  padding: 4px 12px;
  background: rgba(64, 169, 255, 0.1);
  color: var(--el-color-primary);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.video-preview {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
      display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(64, 169, 255, 0.05);
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.video-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
}

.video-name {
  font-weight: 500;
}

.video-size {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.video-player {
      position: relative;
  width: 100%;
  background: black;
  aspect-ratio: 16/9;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.player-overlay {
        position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-animation {
  text-align: center;
  color: white;
}

.rotating {
  font-size: 24px;
  animation: rotate 1s linear infinite;
}

.detection-controls {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
}

.verify-button {
  width: 200px;
  height: 40px;
  font-size: 1rem;
}

.detection-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.detection-progress {
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-text {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
}

.progress-value {
  color: var(--el-color-primary);
  font-weight: 500;
}

.progress-bar {
  margin: 0;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-verify {
    padding: 16px;
  }

  .upload-content {
    padding: 24px;
  }

  .upload-icon {
    font-size: 36px;
  }

  .upload-text h3 {
    font-size: 1.1rem;
  }

  .verify-button {
    width: 100%;
  }
}

.preview-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.delete-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  font-size: 0.9rem;
  border-radius: 8px;
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.2);
  color: var(--el-color-danger);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.delete-button .button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete-button .button-bg {
  position: absolute;
  inset: 0;
  background: var(--el-color-danger);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.delete-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
  color: white;
}

.delete-button:not(:disabled):hover .button-bg {
  opacity: 1;
}

.delete-button .el-icon {
  font-size: 1.1em;
  transition: transform 0.3s ease;
}

.delete-button:not(:disabled):hover .el-icon {
  transform: scale(1.1);
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .preview-header {
    padding: 12px;
  }
  
  .preview-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  .delete-button {
    height: 32px;
    padding: 0 12px;
    font-size: 0.85rem;
  }
  
  .delete-button .button-content {
    gap: 4px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .delete-button {
    background: rgba(245, 108, 108, 0.15);
    border-color: rgba(245, 108, 108, 0.3);
  }
  
  .delete-button:not(:disabled):hover {
    box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  }
}

/* 视频预览区域样式优化 */
.video-preview {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(64, 169, 255, 0.15);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(
    to bottom,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.03)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.video-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-badge {
  position: relative;
  width: 40px;
  height: 40px;
        background: rgba(64, 169, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-badge .el-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--el-color-success);
  border-radius: 50%;
  border: 2px solid white;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 0.95rem;
}

.video-size {
  color: var(--el-text-color-secondary);
  font-size: 0.85rem;
}

/* 视频播放器样式优化 */
.video-player {
        position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 16/9;
  border-radius: 4px;
  overflow: hidden;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.player-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-animation {
        text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.rotating {
  font-size: 28px;
  animation: rotate 1.5s linear infinite;
}

/* 检测控制区域样式优化 */
.detection-controls {
  padding: 20px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.8)
  );
  border-top: 1px solid rgba(64, 169, 255, 0.1);
}

.verify-button {
  min-width: 180px;
  height: 44px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.verify-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 169, 255, 0.25);
}

.button-content {          display: flex;          align-items: center;  gap: 8px;  font-size: 1rem;  font-weight: 500; }

.detection-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  padding: 8px 12px;
  background: rgba(64, 169, 255, 0.05);
  border-radius: 6px;
}

/* 进度条样式优化 */
.detection-progress {
  margin-top: 0;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid rgba(64, 169, 255, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.progress-value {
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .preview-header {
    padding: 12px;
  }

  .info-badge {
    width: 36px;
    height: 36px;
  }

  .info-badge .el-icon {
    font-size: 18px;
  }

  .video-name {
    font-size: 0.9rem;
  }

  .detection-controls {
    padding: 16px;
  }

  .verify-button {
    width: 100%;
    height: 40px;
  }

  .button-content {
    font-size: 0.95rem;
  }

  .detection-tips {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
}

/* 修改视频预览头部样式 */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(64, 169, 255, 0.05);
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

/* 删除按钮样式优化 */
.delete-button {
  margin-left: auto; /* 确保按钮靠右对齐 */
  height: 32px;
  padding: 0 12px;
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.2);
  color: var(--el-color-danger);
}

.delete-button .button-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-button:not(:disabled):hover {
  background: var(--el-color-danger);
  color: white;
  border-color: var(--el-color-danger);
}

.delete-button .el-icon {
  font-size: 14px;
}

/* 视频信息样式优化 */
.video-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .preview-header {
    padding: 8px 12px;
  }

  .delete-button {
    padding: 0 8px;
    height: 28px;
  }

  .delete-button .button-content {
    gap: 2px;
  }

  .delete-button span {
    font-size: 12px;
  }
}

/* 视频预览区域样式优化 */
.video-preview {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.video-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.video-size {
  font-size: 12px;
  color: #909399;
}

.video-delete-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-delete-btn .el-icon {
  margin-right: 4px;
}

/* 视频播放器样式 */
.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .video-header {
    padding: 8px 12px;
  }

  .video-name {
    font-size: 13px;
  }

  .video-size {
    font-size: 11px;
  }

  .video-delete-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

/* 控制按钮区域样式更新 */
.control-buttons {
  display: flex;
  gap: 12px;
          justify-content: center;
  align-items: center;
}

.verify-button,
.delete-video-btn {
  min-width: 140px;
  height: 44px;
}

.delete-video-btn {
  background: rgba(245, 108, 108, 0.1);
  border-color: var(--el-color-danger);
  color: var(--el-color-danger);
}

.delete-video-btn:hover {
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);
          color: white;
        }
        
/* 移动端适配 */
@media (max-width: 768px) {
  .control-buttons {
    flex-direction: column;
    width: 100%;
  }

  .verify-button,
  .delete-video-btn {
    width: 100%;
    height: 40px;
  }
}

.image-verify {
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}

.upload-area {
  min-height: 280px;
  border: 2px dashed rgba(64, 169, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--el-color-primary);
  background: rgba(64, 169, 255, 0.02);
}

.upload-content {
  text-align: center;
  padding: 32px;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.upload-text h3 {
  font-size: 1.2rem;
  margin: 0 0 8px;
  color: var(--el-text-color-primary);
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.supported-formats {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.format-tag {
  padding: 4px 12px;
  background: rgba(64, 169, 255, 0.1);
  border-radius: 12px;
            font-size: 0.8rem;
  color: var(--el-color-primary);
}

.image-preview {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(64, 169, 255, 0.05);
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.image-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-name {
  font-size: 0.9rem;
  color: var(--el-text-color-primary);
}

.preview-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f5f7fa;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.rotating {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.image-actions {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.verify-btn {
  min-width: 160px;
}

.detection-progress {
  padding: 0 16px 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
}

.progress-bar {
  height: 4px;
  background: rgba(64, 169, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--el-color-primary);
  transition: width 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .image-verify {
    padding: 16px;
  }

  .upload-area {
    min-height: 200px;
  }

  .upload-icon {
    font-size: 36px;
  }

  .upload-text h3 {
    font-size: 1rem;
  }

  .verify-btn {
    width: 100%;
  }
}

/* 字体样式优化 */
.upload-text h3 {
  font-size: 1.4rem;
            font-weight: 600;
  margin: 0 0 12px;
            color: var(--el-text-color-primary);
  letter-spacing: 0.5px;
  line-height: 1.4;
          }
          
.upload-hint {
  font-size: 1rem;
            color: var(--el-text-color-secondary);
  line-height: 1.6;
  letter-spacing: 0.3px;
  margin-bottom: 16px;
}

.format-tag {
  padding: 6px 16px;
  background: rgba(64, 169, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--el-color-primary);
  letter-spacing: 0.5px;
}

.image-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
  letter-spacing: 0.3px;
}

.image-loading {
  font-size: 0.95rem;
  letter-spacing: 0.2px;
}

.progress-info {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 按钮文字样式 */
.verify-btn {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.delete-btn {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 移动端字体适配 */
@media (max-width: 768px) {
  .upload-text h3 {
    font-size: 1.2rem;
    margin: 0 0 8px;
  }

  .upload-hint {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .format-tag {
    padding: 4px 12px;
    font-size: 0.85rem;
  }

  .image-name {
    font-size: 0.9rem;
  }

  .progress-info {
    font-size: 0.9rem;
  }

  .verify-btn {
    font-size: 0.95rem;
  }

  .delete-btn {
    font-size: 0.85rem;
  }
}

/* 输入提示样式优化 */
.input-tips {
  margin: 12px 0;
  padding: 12px 16px;
  background: rgba(64, 169, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  line-height: 1.4;
}

.tip-item .el-icon {
  color: var(--el-color-primary);
    font-size: 1.1rem;
  }

/* 移动端适配 */
@media (max-width: 768px) {
  .input-tips {
    padding: 10px 14px;
  }

  .tip-item {
    font-size: 0.85rem;
    gap: 6px;
  }

  .tip-item .el-icon {
    font-size: 1rem;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .input-tips {
    background: rgba(64, 169, 255, 0.08);
    border-color: rgba(64, 169, 255, 0.15);
  }
}
    
    .feature-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
  
  .feature-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    backdrop-filter: blur(10px);
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon {
      width: 50px;
      height: 50px;
      margin: 0 auto 15px;
      background: var(--el-color-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .el-icon {
        font-size: 24px;
        color: white;
      }
    }
    
    h4 {
      margin: 0 0 10px;
      color: var(--el-color-white);
    }
    
    p {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
    
    .feature-stats {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      
      .stat-item {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--el-color-primary);
        }
        
        .stat-label {
          display: block;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
    }
    
    .analysis-flow {
  margin-top: 40px;
  
  .flow-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    
    .el-icon {
      color: var(--el-color-primary);
    }
  }
      
      .flow-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
        
        &::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 0;
    }
    
    .flow-step {
      position: relative;
      z-index: 1;
      text-align: center;
      flex: 1;
      
      .step-number {
        width: 40px;
        height: 40px;
        background: var(--el-color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
        color: white;
        font-weight: bold;
      }
      
      .step-content {
        h5 {
          margin: 0 0 5px;
          color: var(--el-color-white);
        }
        
        p {
          margin: 0;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

/* ... 现有代码 ... */

/* 检测结果区域优化 */
.verify-result {
  position: sticky; /* 使结果区域保持在视口中 */
  top: 24px;
  min-height: 200px;
  height: calc(100vh - 48px); /* 减去上下间距 */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-section {
  height: auto; /* 改为自适应高度 */
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 12px 48px rgba(64, 169, 255, 0.08);
  border: 1px solid rgba(64, 169, 255, 0.15);
  position: relative;
  /* 移除 overflow: auto; */
  backdrop-filter: blur(20px);
}

/* 布局容器优化 */
.verify-layout {
  display: grid;
  grid-template-columns: minmax(360px, 0.8fr) minmax(460px, 1fr);
  gap: 24px;
  margin: 24px auto;
  max-width: 1400px;
  padding: 0 24px;
  align-items: start;
  min-height: calc(100vh - 48px); /* 确保最小高度 */
}

/* 检测控制台高度对齐 */
.verify-main {
  position: relative;
  height: fit-content;
  min-height: calc(100vh - 48px);
}

/* 移动端适配优化 */
@media (max-width: 1200px) {
  .verify-layout {
    gap: 20px;
    padding: 0 20px;
  }

  .verify-result {
    position: relative;
    top: 0;
    height: auto;
  }
}

@media (max-width: 992px) {
  .verify-layout {
    grid-template-columns: 1fr;
    max-width: 800px;
  }

  .verify-result {
    height: auto;
    min-height: 0;
  }

  .result-section {
    height: auto;
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .verify-layout {
    margin: 16px auto;
    padding: 0 16px;
    gap: 16px;
  }

  .verify-result {
    gap: 16px;
  }

  .result-section {
    padding: 16px;
    gap: 16px;
  }
}

/* 滚动条样式优化 */
.result-section::-webkit-scrollbar {
  width: 6px;
}

.result-section::-webkit-scrollbar-track {
  background: transparent;
}

.result-section::-webkit-scrollbar-thumb {
  background-color: rgba(64, 169, 255, 0.3);
  border-radius: 3px;
}

.result-section::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 169, 255, 0.5);
}

/* 结果头部美化 */
.result-header {
  position: relative;
  padding: 24px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 20px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.result-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.title-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.2);
}

.title-content h2 {
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

/* 评分环形图美化 */
.score-ring {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.ring-background {
  fill: none;
  stroke: rgba(64, 169, 255, 0.1);
}

.ring-progress {
  fill: none;
  stroke: url(#gradient);
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.ring-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 4px;
}

.score-label {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

/* 分析模块美化 */
.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.module-header {
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.03)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.module-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-content {
  padding: 24px;
}

/* 详情卡片美化 */
.detail-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(64, 169, 255, 0.1);
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 169, 255, 0.08);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 1.1rem;
}

.detail-score {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  background: rgba(64, 169, 255, 0.1);
  color: var(--el-color-primary);
}

.detail-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 标签组美化 */
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.analysis-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(64, 169, 255, 0.08);
  color: var(--el-color-primary);
  border: 1px solid rgba(64, 169, 255, 0.2);
  transition: all 0.3s ease;
}

.analysis-tag:hover {
  background: rgba(64, 169, 255, 0.12);
  transform: translateY(-1px);
}

/* 动画效果增强 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-section {
  animation: fadeInUp 0.6s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.analysis-module {
  animation: fadeInUp 0.6s ease-out backwards;
}

.analysis-module:nth-child(1) { animation-delay: 0.1s; }
.analysis-module:nth-child(2) { animation-delay: 0.2s; }
.analysis-module:nth-child(3) { animation-delay: 0.3s; }

/* 分析项目悬停效果增强 */
.analysis-item {
  position: relative;
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 169, 255, 0.1);
}

.analysis-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.analysis-item:hover::after {
  border-color: rgba(64, 169, 255, 0.2);
}

/* 证据标签动画和效果增强 */
.evidence-tag {
  position: relative;
  overflow: hidden;
  animation: fadeInRight 0.4s ease-out backwards;
}

.evidence-tag:nth-child(2) { animation-delay: 0.1s; }
.evidence-tag:nth-child(3) { animation-delay: 0.2s; }
.evidence-tag:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.evidence-tag::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.evidence-tag:hover::before {
  transform: translateX(100%);
}

/* 可视化图表优化 */
.visualization-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-header {
  padding: 16px 20px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-content {
  padding: 20px;
  height: 300px;
  position: relative;
}

/* 环形进度图优化 */
.progress-ring {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.ring-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.ring-circle {
  fill: none;
  stroke-width: 12;
  stroke-linecap: round;
}

.ring-circle-bg {
  stroke: rgba(64, 169, 255, 0.1);
}

.ring-circle-progress {
  stroke: url(#gradient);
  transition: stroke-dashoffset 1.5s ease;
}

/* 渐变定义 */
.score-gradient-high {
  stop-color: #67C23A;
}

.score-gradient-medium {
  stop-color: #E6A23C;
}

.score-gradient-low {
  stop-color: #F56C6C;
}

/* 分析指标卡片 */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(64, 169, 255, 0.12);
  transition: all 0.3s ease;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.metric-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.trend-up {
  color: var(--el-color-success);
}

.trend-down {
  color: var(--el-color-danger);
}

/* 波动图表 */
.wave-chart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  opacity: 0.2;
}

.wave {
  fill: none;
  stroke: var(--el-color-primary);
  stroke-width: 2;
  animation: waveAnimation 3s ease-in-out infinite;
}

@keyframes waveAnimation {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(0);
  }
}

/* 雷达图优化 */
.radar-chart {
  height: 100%;
  width: 100%;
}

/* 词云图优化 */
.word-cloud {
  height: 100%;
  width: 100%;
  position: relative;
}

.word-item {
  position: absolute;
  transition: all 0.3s ease;
}

/* 热力图优化 */
.heatmap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 20px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 1200px) {
  .visualization-section {
    grid-template-columns: 1fr;
  }

  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: 1fr;
  }

  .chart-content {
    height: 250px;
  }

  .progress-ring {
    width: 150px;
    height: 150px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .chart-card {
    background: rgba(255, 255, 255, 0.05);
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.03);
  }

  .ring-circle-bg {
    stroke: rgba(255, 255, 255, 0.1);
  }
}

/* 添加样式 */
.input-tips {
  margin: 12px 0;
  padding: 12px 16px;
  background: rgba(64, 169, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .el-icon {
  font-size: 1.1em;
  color: var(--el-color-primary);
}

.form-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 2;
}

.batch-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;  /* 增大宽度 */
  height: 44px; /* 增大高度，与按钮高度一致 */
  border-radius: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.15),
    rgba(64, 169, 255, 0.1)
  );
  color: var(--el-color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 2px 6px rgba(64, 169, 255, 0.1);
}

.batch-hint:hover {
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.2),
    rgba(64, 169, 255, 0.15)
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.15);
  border-color: rgba(64, 169, 255, 0.3);
}

.batch-hint .el-icon {
  font-size: 1.8em; /* 进一步增大图标尺寸 */
  filter: drop-shadow(0 2px 4px rgba(64, 169, 255, 0.2));
}

/* 移动端适配 */
@media (max-width: 768px) {
  .action-group {
    gap: 6px;
  }

  .batch-hint {
    width: 40px;  /* 移动端稍微小一点 */
    height: 40px;
  }

  .batch-hint .el-icon {
    font-size: 1.5em;
  }
}

.hidden-input {
  display: none;
}

/* 添加伪造分析相关样式 */
.forgery-analysis {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 247, 237, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--el-color-warning);
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.forgery-details {
  padding: 20px;
  border-radius: 8px;
}

.forgery-characteristics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.pattern-card {
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-color-warning);
  font-weight: 500;
}

.pattern-desc {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 8px 0;
}

.evidence-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
}

.forgery-recommendations {
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.forgery-recommendations h4 {
  color: var(--el-color-warning);
  margin: 0 0 12px 0;
}

.forgery-recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.forgery-recommendations li {
  margin: 8px 0;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

/* 伪造分析样式 */
.forgery-analysis {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 247, 237, 0.6);
  border: 1px solid rgba(230, 162, 60, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--el-color-warning-dark);
}

.forgery-level {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 247, 237, 0.4);
  border-radius: 8px;
}

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.level-badge.severe {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

.level-badge.moderate {
  background: rgba(230, 162, 60, 0.1);
  color: var(--el-color-warning);
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.pattern-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(230, 162, 60, 0.1);
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-color-warning-dark);
}

.pattern-evidence {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.tips-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--el-text-color-secondary);
}

.tips-list li::before {
  content: "•";
  color: var(--el-color-warning);
  font-size: 1.2em;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .forgery-analysis {
    background: rgba(255, 247, 237, 0.05);
  }
  
  .pattern-card {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .forgery-level {
    background: rgba(255, 247, 237, 0.03);
  }
}

/* 可信度评分样式 */
.credibility-overview {
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.overview-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-circle svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.score-path {
  transition: stroke-dasharray 1s ease-out;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-unit {
  font-size: 14px;
  opacity: 0.8;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-title {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.info-level {
  font-size: 20px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.level-high {
  color: var(--el-color-success);
  background: rgba(103, 194, 58, 0.1);
}

.level-medium {
  color: var(--el-color-warning);
  background: rgba(230, 162, 60, 0.1);
}

.level-low {
  color: var(--el-color-danger);
  background: rgba(245, 108, 108, 0.1);
}

.score-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
}

.metric-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.8s ease-out;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .overview-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .score-display {
    justify-content: center;
  }

  .score-circle {
    width: 100px;
    height: 100px;
  }

  .score-value {
    font-size: 28px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .credibility-overview {
    background: rgba(255, 255, 255, 0.05);
  }

  .metric-bar {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 分析模块布局样式 */
.analysis-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.analysis-module:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 169, 255, 0.1);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.module-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-score {
  margin-left: auto;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(64, 169, 255, 0.1);
  color: var(--el-color-primary);
}

.module-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
}

.analysis-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.item-title {
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.item-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.evidence-tag {
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 0.75rem;
  background: rgba(64, 169, 255, 0.08);
  color: var(--el-text-color-regular);
  border: 1px solid rgba(64, 169, 255, 0.15);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .analysis-modules {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .analysis-modules {
    grid-template-columns: 1fr;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .analysis-module {
    background: rgba(255, 255, 255, 0.05);
  }

  .analysis-item {
    background: rgba(255, 255, 255, 0.03);
  }
}

/* 结果区域动画效果 */
.result-section {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 结果标题样式增强 */
.result-title h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 8px;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

/* 结果元信息样式 */
.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.meta-item .el-icon {
  font-size: 1.1em;
  color: var(--el-color-primary);
}

/* 评分环形图样式优化 */
.score-circle {
  position: relative;
  width: 160px;
  height: 160px;
}

.score-circle svg {
  transform: rotate(-90deg);
  filter: drop-shadow(0 2px 8px rgba(64, 169, 255, 0.2));
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.score-value {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-label {
  margin-top: 4px;
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

/* 分析模块标题样式 */
.module-header {
  padding: 16px 20px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.03)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-score {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(64, 169, 255, 0.1);
  color: var(--el-color-primary);
  transition: all 0.3s ease;
}

/* 分析项目样式增强 */
.analysis-item {
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.08);
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.item-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

/* 证据标签动画效果 */
.evidence-tag {
  animation: fadeInUp 0.4s ease-out backwards;
}

.evidence-tag:nth-child(2) { animation-delay: 0.1s; }
.evidence-tag:nth-child(3) { animation-delay: 0.2s; }
.evidence-tag:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导出按钮样式优化 */
.export-btn {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 169, 255, 0.2);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.3);
}

.export-btn .el-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.export-btn:hover .el-icon {
  transform: translateY(-1px);
}

/* 移动端适配增强 */
@media (max-width: 768px) {
  .result-title h2 {
    font-size: 1.4rem;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-value {
    font-size: 2rem;
  }
  
  .score-label {
    font-size: 0.9rem;
  }
  
  .module-header {
    padding: 12px 16px;
  }
  
  .module-title {
    font-size: 1rem;
  }
  
  .export-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
}

/* 质疑通道整体布局优化 */
.dispute-channel {
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(64, 169, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

/* 通道头部样式优化 */
.channel-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--el-color-warning),
    var(--el-color-warning-light-3)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
}

.header-text {
  flex: 1;
}

.channel-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 4px;
  background: linear-gradient(135deg,
    var(--el-color-warning),
    var(--el-color-warning-dark)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.channel-subtitle {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.channel-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  padding: 12px 16px;
  background: rgba(230, 162, 60, 0.05);
  border-radius: 8px;
  border-left: 4px solid var(--el-color-warning);
}

/* 表单区域样式优化 */
.dispute-form {
  margin-top: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.label-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.label-required {
  color: var(--el-color-danger);
  font-weight: bold;
}

.label-optional {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

/* 上传区域样式优化 */
.evidence-upload {
  margin: 16px 0;
}

.upload-content {
  text-align: center;
  padding: 32px;
}

.upload-icon {
  font-size: 32px;
  color: var(--el-color-warning);
  margin-bottom: 12px;
}

.upload-text {
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

/* 表单提示样式 */
.form-tip {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 操作按钮样式优化 */
.form-actions {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: flex-start;
}

.submit-btn {
  min-width: 120px;
  height: 40px;
  background: linear-gradient(135deg,
    var(--el-color-warning),
    var(--el-color-warning-light-3)
  );
  border: none;
  padding: 0 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dispute-channel {
    padding: 16px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .channel-title {
    font-size: 1.2rem;
  }

  .channel-subtitle {
    font-size: 0.9rem;
  }

  .channel-description {
    font-size: 0.85rem;
    padding: 10px 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .el-button {
    width: 100%;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .dispute-channel {
    background: rgba(255, 255, 255, 0.05);
  }

  .channel-description {
    background: rgba(230, 162, 60, 0.1);
  }

  .upload-content {
    background: rgba(255, 255, 255, 0.02);
  }
}

/* 添加动画效果 */
.dispute-channel {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单项动画 */
.el-form-item {
  animation: slideIn 0.4s ease-out backwards;
}

.el-form-item:nth-child(1) { animation-delay: 0.1s; }
.el-form-item:nth-child(2) { animation-delay: 0.2s; }
.el-form-item:nth-child(3) { animation-delay: 0.3s; }
.el-form-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 暗色模式增强 */
@media (prefers-color-scheme: dark) {
  .result-title h2 {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.9),
      var(--el-color-primary)
    );
    -webkit-background-clip: text;
  }
  
  .module-header {
    background: linear-gradient(135deg,
      rgba(64, 169, 255, 0.12),
      rgba(64, 169, 255, 0.06)
    );
  }
  
  .export-btn {
    background: linear-gradient(135deg,
      var(--el-color-primary),
      var(--el-color-primary-dark-2)
    );
  }
}

/* 结果标题样式 */
.result-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.title-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.title-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(64, 158, 255, 0.2), rgba(0, 208, 130, 0.2));
  animation: float 20s infinite alternate;
}

@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}

.title-icon:hover::before {
  opacity: 1;
}

.title-content h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 2px;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

/* 可信度概览样式优化 */
.credibility-overview {
  padding: 8px;
  margin-bottom: 8px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.8)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.15);
}

.overview-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px; /* 减小网格间距 */
  align-items: center;
}

/* 评分环形样式优化 */
.score-circle {
  width: 50px; /* 减小环形尺寸 */
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.1),
    rgba(64, 169, 255, 0.05)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1px; /* 减小内部间距 */
  border: 1.5px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 2px 6px rgba(64, 169, 255, 0.1);
}

.score-value {
  font-size: 1.1rem; /* 减小分数字号 */
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-label {
  font-size: 0.7rem; /* 减小标签字号 */
  color: var(--el-text-color-secondary);
}

/* 评分指标样式优化 */
.score-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 减小指标间距 */
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name,
.metric-value {
  font-size: 0.75rem; /* 减小指标字号 */
  color: var(--el-text-color-regular);
}

.metric-bar {
  height: 2px; /* 减小进度条高度 */
  background: rgba(0, 0, 0, 0.04);
  border-radius: 1px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.6s ease-out;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .credibility-overview {
    padding: 6px;
  }

  .overview-main {
    gap: 6px;
  }

  .score-circle {
    width: 45px;
    height: 45px;
  }

  .score-value {
    font-size: 1rem;
  }

  .score-label {
    font-size: 0.65rem;
  }

  .metric-name,
  .metric-value {
    font-size: 0.7rem;
  }

  .metric-bar {
    height: 1.5px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .credibility-overview {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.03)
    );
  }

  .metric-bar {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 分析模块布局优化 */
.analysis-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out backwards;
}

.analysis-module:nth-child(1) { animation-delay: 0.1s; }
.analysis-module:nth-child(2) { animation-delay: 0.2s; }
.analysis-module:nth-child(3) { animation-delay: 0.3s; }

.analysis-module:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(64, 169, 255, 0.12);
}

/* 分析模块内容样式优化 */
.module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.module-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-content {
  padding: 8px;
}

.analysis-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.1);
}

.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.evidence-tag {
  padding: 1px 6px;
  background: rgba(64, 169, 255, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: var(--el-text-color-regular);
  border: 1px solid rgba(64, 169, 255, 0.15);
  transition: all 0.3s ease;
}

/* 图表区域优化 */
.visualization-section {
  gap: 12px;
  margin-top: 12px;
}

.chart-card {
  border-radius: 8px;
}

.chart-header {
  padding: 8px 12px;
}

.chart-title {
  font-size: 0.9rem;
}

.chart-content {
  padding: 12px;
  height: 200px;
}

/* 指标卡片优化 */
.metric-cards {
  gap: 12px;
  margin-top: 16px;
}

.metric-card {
  padding: 16px;
  border-radius: 12px;
}

.metric-header {
  gap: 8px;
  margin-bottom: 12px;
}

.metric-icon {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.metric-title {
  font-size: 0.9rem;
}

.metric-value {
  font-size: 1.6rem;
  margin: 6px 0;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .result-section {
    padding: 12px;
    gap: 10px;
  }

  .title-content h2 {
    font-size: 1.1rem;
  }

  .analysis-modules {
    gap: 10px;
  }

  .analysis-module {
    padding: 8px;
  }

  .evidence-tag {
    font-size: 0.7rem;
    padding: 1px 4px;
  }
  
  .chart-content {
    height: 200px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .chart-card {
    background: rgba(255, 255, 255, 0.05);
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.03);
  }

  .ring-circle-bg {
    stroke: rgba(255, 255, 255, 0.1);
  }
}

/* 添加样式 */
.input-tips {
  margin: 12px 0;
  padding: 12px 16px;
  background: rgba(64, 169, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .el-icon {
  font-size: 1.1em;
  color: var(--el-color-primary);
}

.form-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 2;
}

.batch-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.15),
    rgba(64, 169, 255, 0.1)
  );
  color: var(--el-color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(64, 169, 255, 0.2);
  box-shadow: 0 2px 6px rgba(64, 169, 255, 0.1);
}

.batch-hint:hover {
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.2),
    rgba(64, 169, 255, 0.15)
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.15);
  border-color: rgba(64, 169, 255, 0.3);
}

.batch-hint .el-icon {
  font-size: 1.8em;
  filter: drop-shadow(0 2px 4px rgba(64, 169, 255, 0.2));
}

@media (max-width: 768px) {
  .action-group {
    gap: 6px;
  }

  .batch-hint {
    width: 40px;
    height: 40px;
  }

  .batch-hint .el-icon {
    font-size: 1.5em;
  }
}

.hidden-input {
  display: none;
}

/* 添加伪造分析相关样式 */
.forgery-analysis {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 247, 237, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--el-color-warning);
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.forgery-details {
  padding: 20px;
  border-radius: 8px;
}

.forgery-characteristics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.pattern-card {
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-color-warning);
  font-weight: 500;
}

.pattern-desc {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 8px 0;
}

.evidence-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
}

.forgery-recommendations {
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.forgery-recommendations h4 {
  color: var(--el-color-warning);
  margin: 0 0 12px 0;
}

.forgery-recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.forgery-recommendations li {
  margin: 8px 0;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

/* 伪造分析样式 */
.forgery-analysis {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 247, 237, 0.6);
  border: 1px solid rgba(230, 162, 60, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--el-color-warning-dark);
}

.forgery-level {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 247, 237, 0.4);
  border-radius: 8px;
}

.level-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.level-badge.severe {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

.level-badge.moderate {
  background: rgba(230, 162, 60, 0.1);
  color: var(--el-color-warning);
}

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.pattern-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(230, 162, 60, 0.1);
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-color-warning-dark);
}

.pattern-evidence {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.tips-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--el-text-color-secondary);
}

.tips-list li::before {
  content: "•";
  color: var(--el-color-warning);
  font-size: 1.2em;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .forgery-analysis {
    background: rgba(255, 247, 237, 0.05);
  }
  
  .pattern-card {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .forgery-level {
    background: rgba(255, 247, 237, 0.03);
  }
}

/* 可信度评分样式 */
.credibility-overview {
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.overview-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-circle svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.score-path {
  transition: stroke-dasharray 1s ease-out;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.score-unit {
  font-size: 14px;
  opacity: 0.8;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-title {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.info-level {
  font-size: 20px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.level-high {
  color: var(--el-color-success);
  background: rgba(103, 194, 58, 0.1);
}

.level-medium {
  color: var(--el-color-warning);
  background: rgba(230, 162, 60, 0.1);
}

.level-low {
  color: var(--el-color-danger);
  background: rgba(245, 108, 108, 0.1);
}

.score-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
}

.metric-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  transition: width 0.8s ease-out;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .overview-main {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .score-display {
    justify-content: center;
  }

  .score-circle {
    width: 100px;
    height: 100px;
  }

  .score-value {
    font-size: 28px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .credibility-overview {
    background: rgba(255, 255, 255, 0.05);
  }

  .metric-bar {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 分析模块布局样式 */
.analysis-modules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.analysis-module {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px;
  border: 1px solid rgba(64, 169, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.analysis-module:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(64, 169, 255, 0.1);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.02)
  );
  border-radius: 6px;
  border: 1px solid rgba(64, 169, 255, 0.12);
}

.module-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-content {
  padding: 8px;
}

.analysis-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 8px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.evidence-tag {
  padding: 1px 6px;
  background: rgba(64, 169, 255, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: var(--el-text-color-regular);
  border: 1px solid rgba(64, 169, 255, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .analysis-modules {
    gap: 8px;
  }

  .analysis-module {
    padding: 8px;
  }

  .module-header {
    padding: 6px;
  }

  .module-title {
    font-size: 0.85rem;
  }

  .evidence-tag {
    font-size: 0.7rem;
    padding: 1px 4px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .analysis-module {
    background: rgba(255, 255, 255, 0.05);
  }

  .analysis-item {
    background: rgba(255, 255, 255, 0.03);
  }
}

/* 结果区域动画效果 */
.result-section {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 结果标题样式增强 */
.result-title h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 8px;
  background: linear-gradient(135deg,
    var(--el-text-color-primary),
    var(--el-color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.3;
}

/* 结果元信息样式 */
.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.meta-item .el-icon {
  font-size: 1.1em;
  color: var(--el-color-primary);
}

/* 评分环形图样式优化 */
.score-circle {
  position: relative;
  width: 160px;
  height: 160px;
}

.score-circle svg {
  transform: rotate(-90deg);
  filter: drop-shadow(0 2px 8px rgba(64, 169, 255, 0.2));
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.score-value {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-label {
  margin-top: 4px;
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

/* 分析模块标题样式 */
.module-header {
  padding: 16px 20px;
  background: linear-gradient(135deg,
    rgba(64, 169, 255, 0.08),
    rgba(64, 169, 255, 0.03)
  );
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.module-score {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(64, 169, 255, 0.1);
  color: var(--el-color-primary);
  transition: all 0.3s ease;
}

/* 分析项目样式增强 */
.analysis-item {
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.08);
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.item-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

/* 证据标签动画效果 */
.evidence-tag {
  animation: fadeInUp 0.4s ease-out backwards;
}

.evidence-tag:nth-child(2) { animation-delay: 0.1s; }
.evidence-tag:nth-child(3) { animation-delay: 0.2s; }
.evidence-tag:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导出按钮样式优化 */
.export-btn {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 169, 255, 0.2);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 169, 255, 0.3);
}

.export-btn .el-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.export-btn:hover .el-icon {
  transform: translateY(-1px);
}

/* 移动端适配增强 */
@media (max-width: 768px) {
  .result-title h2 {
    font-size: 1.4rem;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-value {
    font-size: 2rem;
  }
  
  .score-label {
    font-size: 0.9rem;
  }
  
  .module-header {
    padding: 12px 16px;
  }
  
  .module-title {
    font-size: 1rem;
  }
  
  .export-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }
}

/* 暗色模式增强 */
@media (prefers-color-scheme: dark) {
  .result-title h2 {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.9),
      var(--el-color-primary)
    );
    -webkit-background-clip: text;
  }
  
  .module-header {
    background: linear-gradient(135deg,
      rgba(64, 169, 255, 0.12),
      rgba(64, 169, 255, 0.06)
    );
  }
  
  .export-btn {
    background: linear-gradient(135deg,
      var(--el-color-primary),
      var(--el-color-primary-dark-2)
    );
  }
}

/* 结果标签页样式 */
.result-tabs {
  margin-top: 24px;
}

.result-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(64, 169, 255, 0.1);
}

.result-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.result-tabs :deep(.el-tabs__item) {
  font-size: 1rem;
  padding: 0 24px;
  height: 44px;
  line-height: 44px;
  transition: all 0.3s ease;
}

.result-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 600;
  color: var(--el-color-primary);
}

.result-tab-pane {
  padding: 0 4px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-label .el-icon {
  font-size: 1.2em;
}

/* 伪造分析标签页样式 */
.forgery-analysis {
  padding: 24px;
  background: rgba(255, 247, 237, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(230, 162, 60, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--el-color-warning-dark);
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .result-tabs :deep(.el-tabs__item) {
    font-size: 0.9rem;
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
  }
  
  .forgery-analysis {
    padding: 16px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .forgery-analysis {
    background: rgba(255, 247, 237, 0.05);
    border-color: rgba(230, 162, 60, 0.3);
  }
  
  .result-tabs :deep(.el-tabs__item) {
    color: var(--el-text-color-regular);
  }
  
  .result-tabs :deep(.el-tabs__item.is-active) {
    color: var(--el-color-primary);
  }
}

/* 基础分析内容布局 */
.basic-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 可信度概览样式优化 */
.credibility-overview {
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(64, 169, 255, 0.1);
}

</style> 