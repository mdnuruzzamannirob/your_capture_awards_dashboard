{
  "success": true,
  "message": "Contest creation options fetched successfully",
  "meta": null,
  "data": {
    "categories": [
      {
        "id": "674b00000000000000000001",
        "slug": "street-photography",
        "name": "Street photography",
        "description": null,
        "isActive": true,
        "order": 10
      }
    ],
    "rules": [
      {
        "key": "SUBMISSION_LIMIT",
        "label": "Submission Limit",
        "icon": "number-circle",
        "inputType": "number",
        "defaultValue": 4,
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 10
      },
      {
        "key": "SUBMISSION_RULES",
        "label": "Submission Rules",
        "icon": "image-upload",
        "inputType": "object",
        "defaultValue": {
          "intro": "Do not post:",
          "disallowed": [
            "Non-relevant images",
            "AI images"
          ],
          "removalNotice": "Images that don't comply may be removed.",
          "allowAiImages": false,
          "duplicatePolicy": "DISALLOW_SAME_PHOTO"
        },
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 20
      },
      {
        "key": "LEVEL_REQUIREMENTS",
        "label": "Level Requirements",
        "icon": "level-stars",
        "inputType": "list",
        "defaultValue": [
          {
            "level": "POPULAR",
            "votes": 50
          },
          {
            "level": "SKILLED",
            "votes": 250
          },
          {
            "level": "PREMIER",
            "votes": 900
          },
          {
            "level": "ELITE",
            "votes": 1900
          },
          {
            "level": "ALL_STAR",
            "votes": 5000
          }
        ],
        "appliesTo": [
          "RANKING",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 30
      },
      {
        "key": "SUBMISSION_FORMAT",
        "label": "Submission Format",
        "icon": "image-plus",
        "inputType": "object",
        "defaultValue": {
          "mimeTypes": [
            "image/jpeg"
          ],
          "minWidth": 700,
          "minHeight": 700,
          "maxSizeMB": 25
        },
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 40
      },
      {
        "key": "ELIGIBILITY",
        "label": "Eligibility",
        "icon": "file-check",
        "inputType": "object",
        "defaultValue": {
          "minAge": 18,
          "text": "Open to all photographers ages 18 and above.",
          "requiresAcceptance": true
        },
        "appliesTo": [
          "JOIN",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 50
      },
      {
        "key": "COPYRIGHT",
        "label": "Copyright",
        "icon": "copyright",
        "inputType": "object",
        "defaultValue": {
          "text": "You must own all submitted images.",
          "requiresOwnership": true,
          "requiresAcceptance": true
        },
        "appliesTo": [
          "JOIN",
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 60
      },
      {
        "key": "VOTING",
        "label": "Voting",
        "icon": "vote",
        "inputType": "object",
        "defaultValue": {
          "text": "Voting is done by members only.",
          "membersOnly": true,
          "requireContestParticipant": true,
          "disallowSelfVote": true,
          "blindVoting": true
        },
        "appliesTo": [
          "VOTING",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 70
      },
      {
        "key": "PARTICIPATION",
        "label": "Participation",
        "icon": "user",
        "inputType": "object",
        "defaultValue": {
          "text": "By entering you accept the Terms of Use.",
          "requiresTermsAcceptance": true,
          "termsUrl": null
        },
        "appliesTo": [
          "JOIN",
          "DISPLAY"
        ],
        "displayOnly": false,
        "order": 80
      }
    ],
    "prizes": [
      {
        "id": "670700000000000000000010",
        "category": "TOP_PHOTO",
        "type": "TOP_PHOTO",
        "target": "PHOTO",
        "rankLimit": null,
        "title": "Top Photo",
        "description": "Highest-ranked photo in the contest.",
        "icon": "trophy",
        "boost": 10,
        "swap": 1,
        "key": 1,
        "coin": 500,
        "isActive": true,
        "isDefault": true,
        "order": 10,
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      },
      {
        "id": "670700000000000000000011",
        "category": "TOP_PHOTOGRAPHER",
        "type": "TOP_PHOTOGRAPHER",
        "target": "PHOTOGRAPHER",
        "rankLimit": null,
        "title": "Top Photographer",
        "description": "Highest total contest score.",
        "icon": "camera",
        "boost": 20,
        "swap": 2,
        "key": 2,
        "coin": 1000,
        "isActive": true,
        "isDefault": true,
        "order": 20,
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      },
      {
        "id": "670700000000000000000012",
        "category": "YC_PICK",
        "type": "YC_PICK",
        "target": "PHOTO",
        "rankLimit": null,
        "title": "YC Pick",
        "description": "Editorial photo selected by Your Capture Award.",
        "icon": "star",
        "boost": 5,
        "swap": 0,
        "key": 1,
        "coin": 250,
        "isActive": true,
        "isDefault": false,
        "order": 40,
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      },
      {
        "id": "{{prizeId}}",
        "category": "TOP_10",
        "type": "TOP_RANK",
        "target": "PHOTO",
        "rankLimit": 10,
        "title": "Top 10 Photos",
        "description": "Awarded to the 10 highest-ranked photos.",
        "icon": "image",
        "boost": 5,
        "swap": 0,
        "key": 1,
        "coin": 500,
        "isActive": true,
        "isDefault": false,
        "order": 50,
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      }
    ],
    "supportedImageMimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp"
    ]
  }
}
{
  "success": true,
  "message": "All contests fetched successfully",
  "meta": null,
  "data": {
    "contests": [
      {
        "id": "{{contestId}}",
        "title": "Street Photography Weekly",
        "description": "Capture everyday life in public spaces.",
        "banner": "https://images.unsplash.com/photo-1689539137236-b68e436248de",
        "status": "ACTIVE",
        "isMoneyContest": false,
        "maxPrize": 0,
        "minPrize": 0,
        "currency": null,
        "entryFeeCoins": 0,
        "startDate": "2026-07-28T10:00:00.000Z",
        "endDate": "2026-07-28T11:00:00.000Z",
        "creatorId": "{{adminUserId}}",
        "categoryId": "674b00000000000000000001",
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
{
  "success": true,
  "message": "Contest fetched successfully",
  "meta": null,
  "data": {
    "id": "{{contestId}}",
    "title": "Street Photography Weekly",
    "description": "Capture everyday life in public spaces.",
    "banner": "https://images.unsplash.com/photo-1689539137236-b68e436248de",
    "status": "ACTIVE",
    "isMoneyContest": false,
    "maxPrize": 0,
    "minPrize": 0,
    "currency": null,
    "entryFeeCoins": 0,
    "startDate": "2026-07-28T10:00:00.000Z",
    "endDate": "2026-07-28T11:00:00.000Z",
    "creatorId": "{{adminUserId}}",
    "categoryId": "674b00000000000000000001",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "category": {
      "id": "674b00000000000000000001",
      "slug": "street-photography",
      "name": "Street photography",
      "description": null,
      "isActive": true,
      "order": 10
    },
    "rules": [
      {
        "key": "SUBMISSION_LIMIT",
        "label": "Submission Limit",
        "icon": "number-circle",
        "inputType": "number",
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 10,
        "value": 4
      },
      {
        "key": "SUBMISSION_RULES",
        "label": "Submission Rules",
        "icon": "image-upload",
        "inputType": "object",
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 20,
        "value": {
          "intro": "Do not post:",
          "disallowed": [
            "Non-relevant images",
            "AI images"
          ],
          "removalNotice": "Images that don't comply may be removed.",
          "allowAiImages": false,
          "duplicatePolicy": "DISALLOW_SAME_PHOTO"
        }
      },
      {
        "key": "LEVEL_REQUIREMENTS",
        "label": "Level Requirements",
        "icon": "level-stars",
        "inputType": "list",
        "appliesTo": [
          "RANKING",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 30,
        "value": [
          {
            "level": "POPULAR",
            "votes": 50
          },
          {
            "level": "SKILLED",
            "votes": 250
          },
          {
            "level": "PREMIER",
            "votes": 900
          },
          {
            "level": "ELITE",
            "votes": 1900
          },
          {
            "level": "ALL_STAR",
            "votes": 5000
          }
        ]
      },
      {
        "key": "SUBMISSION_FORMAT",
        "label": "Submission Format",
        "icon": "image-plus",
        "inputType": "object",
        "appliesTo": [
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 40,
        "value": {
          "mimeTypes": [
            "image/jpeg"
          ],
          "minWidth": 700,
          "minHeight": 700,
          "maxSizeMB": 25
        }
      },
      {
        "key": "ELIGIBILITY",
        "label": "Eligibility",
        "icon": "file-check",
        "inputType": "object",
        "appliesTo": [
          "JOIN",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 50,
        "value": {
          "minAge": 18,
          "text": "Open to all photographers ages 18 and above.",
          "requiresAcceptance": true
        }
      },
      {
        "key": "COPYRIGHT",
        "label": "Copyright",
        "icon": "copyright",
        "inputType": "object",
        "appliesTo": [
          "JOIN",
          "PHOTO_UPLOAD",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 60,
        "value": {
          "text": "You must own all submitted images.",
          "requiresOwnership": true,
          "requiresAcceptance": true
        }
      },
      {
        "key": "VOTING",
        "label": "Voting",
        "icon": "vote",
        "inputType": "object",
        "appliesTo": [
          "VOTING",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 70,
        "value": {
          "text": "Voting is done by members only.",
          "membersOnly": true,
          "requireContestParticipant": true,
          "disallowSelfVote": true,
          "blindVoting": true
        }
      },
      {
        "key": "PARTICIPATION",
        "label": "Participation",
        "icon": "user",
        "inputType": "object",
        "appliesTo": [
          "JOIN",
          "DISPLAY"
        ],
        "displayOnly": false,
        "enabled": true,
        "order": 80,
        "value": {
          "text": "By entering you accept the Terms of Use.",
          "requiresTermsAcceptance": true,
          "termsUrl": null
        }
      }
    ],
    "prizes": [
      {
        "id": "670700000000000000000001",
        "category": "YC_PICK",
        "type": "YC_PICK",
        "target": "PHOTO",
        "rankLimit": null,
        "slotKey": "YC_PICK:PHOTO",
        "title": "YC Pick",
        "description": "Editorial photo selected by Your Capture Award.",
        "icon": "star",
        "boost": 5,
        "swap": 0,
        "key": 1,
        "coin": 250,
        "enabled": true,
        "order": 40,
        "contestId": "{{contestId}}",
        "prizeId": "670700000000000000000012",
        "createdAt": "2026-07-28T10:00:00.000Z",
        "updatedAt": "2026-07-28T10:00:00.000Z"
      }
    ],
    "joined": false
  }
}
