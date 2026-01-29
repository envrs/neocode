package app

import (
	"errors"
	"time"

	"github.com/neopilot-ai/neocode-sdk-go"
	"github.com/neopilot-ai/neocode/internal/attachment"
	"github.com/neopilot-ai/neocode/internal/id"
)

type Prompt struct {
	Text        string                   `toml:"text"`
	Attachments []*attachment.Attachment `toml:"attachments"`
}

func (p Prompt) ToMessage(
	messageID string,
	sessionID string,
) Message {
	message := neocode.UserMessage{
		ID:        messageID,
		SessionID: sessionID,
		Role:      neocode.UserMessageRoleUser,
		Time: neocode.UserMessageTime{
			Created: float64(time.Now().UnixMilli()),
		},
	}

	text := p.Text
	textAttachments := []*attachment.Attachment{}
	for _, attachment := range p.Attachments {
		if attachment.Type == "text" {
			textAttachments = append(textAttachments, attachment)
		}
	}
	for i := 0; i < len(textAttachments)-1; i++ {
		for j := i + 1; j < len(textAttachments); j++ {
			if textAttachments[i].StartIndex < textAttachments[j].StartIndex {
				textAttachments[i], textAttachments[j] = textAttachments[j], textAttachments[i]
			}
		}
	}
	for _, att := range textAttachments {
		if source, ok := att.GetTextSource(); ok {
			text = text[:att.StartIndex] + source.Value + text[att.EndIndex:]
		}
	}

	parts := []neocode.PartUnion{neocode.TextPart{
		ID:        id.Ascending(id.Part),
		MessageID: messageID,
		SessionID: sessionID,
		Type:      neocode.TextPartTypeText,
		Text:      text,
	}}
	for _, attachment := range p.Attachments {
		text := neocode.FilePartSourceText{
			Start: int64(attachment.StartIndex),
			End:   int64(attachment.EndIndex),
			Value: attachment.Display,
		}
		source := &neocode.FilePartSource{}
		switch attachment.Type {
		case "text":
			continue
		case "file":
			if fileSource, ok := attachment.GetFileSource(); ok {
				source = &neocode.FilePartSource{
					Text: text,
					Path: fileSource.Path,
					Type: neocode.FilePartSourceTypeFile,
				}
			}
		case "symbol":
			if symbolSource, ok := attachment.GetSymbolSource(); ok {
				source = &neocode.FilePartSource{
					Text: text,
					Path: symbolSource.Path,
					Type: neocode.FilePartSourceTypeSymbol,
					Kind: int64(symbolSource.Kind),
					Name: symbolSource.Name,
					Range: neocode.SymbolSourceRange{
						Start: neocode.SymbolSourceRangeStart{
							Line:      float64(symbolSource.Range.Start.Line),
							Character: float64(symbolSource.Range.Start.Char),
						},
						End: neocode.SymbolSourceRangeEnd{
							Line:      float64(symbolSource.Range.End.Line),
							Character: float64(symbolSource.Range.End.Char),
						},
					},
				}
			}
		}
		parts = append(parts, neocode.FilePart{
			ID:        id.Ascending(id.Part),
			MessageID: messageID,
			SessionID: sessionID,
			Type:      neocode.FilePartTypeFile,
			Filename:  attachment.Filename,
			Mime:      attachment.MediaType,
			URL:       attachment.URL,
			Source:    *source,
		})
	}
	return Message{
		Info:  message,
		Parts: parts,
	}
}

func (m Message) ToPrompt() (*Prompt, error) {
	switch m.Info.(type) {
	case neocode.UserMessage:
		text := ""
		attachments := []*attachment.Attachment{}
		for _, part := range m.Parts {
			switch p := part.(type) {
			case neocode.TextPart:
				if p.Synthetic {
					continue
				}
				text += p.Text + " "
			case neocode.FilePart:
				switch p.Source.Type {
				case "file":
					attachments = append(attachments, &attachment.Attachment{
						ID:         p.ID,
						Type:       "file",
						Display:    p.Source.Text.Value,
						URL:        p.URL,
						Filename:   p.Filename,
						MediaType:  p.Mime,
						StartIndex: int(p.Source.Text.Start),
						EndIndex:   int(p.Source.Text.End),
						Source: &attachment.FileSource{
							Path: p.Source.Path,
							Mime: p.Mime,
						},
					})
				case "symbol":
					r := p.Source.Range.(neocode.SymbolSourceRange)
					attachments = append(attachments, &attachment.Attachment{
						ID:         p.ID,
						Type:       "symbol",
						Display:    p.Source.Text.Value,
						URL:        p.URL,
						Filename:   p.Filename,
						MediaType:  p.Mime,
						StartIndex: int(p.Source.Text.Start),
						EndIndex:   int(p.Source.Text.End),
						Source: &attachment.SymbolSource{
							Path: p.Source.Path,
							Name: p.Source.Name,
							Kind: int(p.Source.Kind),
							Range: attachment.SymbolRange{
								Start: attachment.Position{
									Line: int(r.Start.Line),
									Char: int(r.Start.Character),
								},
								End: attachment.Position{
									Line: int(r.End.Line),
									Char: int(r.End.Character),
								},
							},
						},
					})
				}
			}
		}
		return &Prompt{
			Text:        text,
			Attachments: attachments,
		}, nil
	}
	return nil, errors.New("unknown message type")
}

func (m Message) ToSessionChatParams() []neocode.SessionChatParamsPartUnion {
	parts := []neocode.SessionChatParamsPartUnion{}
	for _, part := range m.Parts {
		switch p := part.(type) {
		case neocode.TextPart:
			parts = append(parts, neocode.TextPartInputParam{
				ID:        neocode.F(p.ID),
				Type:      neocode.F(neocode.TextPartInputTypeText),
				Text:      neocode.F(p.Text),
				Synthetic: neocode.F(p.Synthetic),
				Time: neocode.F(neocode.TextPartInputTimeParam{
					Start: neocode.F(p.Time.Start),
					End:   neocode.F(p.Time.End),
				}),
			})
		case neocode.FilePart:
			var source neocode.FilePartSourceUnionParam
			switch p.Source.Type {
			case "file":
				source = neocode.FileSourceParam{
					Type: neocode.F(neocode.FileSourceTypeFile),
					Path: neocode.F(p.Source.Path),
					Text: neocode.F(neocode.FilePartSourceTextParam{
						Start: neocode.F(int64(p.Source.Text.Start)),
						End:   neocode.F(int64(p.Source.Text.End)),
						Value: neocode.F(p.Source.Text.Value),
					}),
				}
			case "symbol":
				source = neocode.SymbolSourceParam{
					Type: neocode.F(neocode.SymbolSourceTypeSymbol),
					Path: neocode.F(p.Source.Path),
					Name: neocode.F(p.Source.Name),
					Kind: neocode.F(p.Source.Kind),
					Range: neocode.F(neocode.SymbolSourceRangeParam{
						Start: neocode.F(neocode.SymbolSourceRangeStartParam{
							Line:      neocode.F(float64(p.Source.Range.(neocode.SymbolSourceRange).Start.Line)),
							Character: neocode.F(float64(p.Source.Range.(neocode.SymbolSourceRange).Start.Character)),
						}),
						End: neocode.F(neocode.SymbolSourceRangeEndParam{
							Line:      neocode.F(float64(p.Source.Range.(neocode.SymbolSourceRange).End.Line)),
							Character: neocode.F(float64(p.Source.Range.(neocode.SymbolSourceRange).End.Character)),
						}),
					}),
					Text: neocode.F(neocode.FilePartSourceTextParam{
						Value: neocode.F(p.Source.Text.Value),
						Start: neocode.F(p.Source.Text.Start),
						End:   neocode.F(p.Source.Text.End),
					}),
				}
			}
			parts = append(parts, neocode.FilePartInputParam{
				ID:       neocode.F(p.ID),
				Type:     neocode.F(neocode.FilePartInputTypeFile),
				Mime:     neocode.F(p.Mime),
				URL:      neocode.F(p.URL),
				Filename: neocode.F(p.Filename),
				Source:   neocode.F(source),
			})
		}
	}
	return parts
}

func (p Prompt) ToSessionChatParams() []neocode.SessionChatParamsPartUnion {
	parts := []neocode.SessionChatParamsPartUnion{
		neocode.TextPartInputParam{
			Type: neocode.F(neocode.TextPartInputTypeText),
			Text: neocode.F(p.Text),
		},
	}
	for _, att := range p.Attachments {
		filePart := neocode.FilePartInputParam{
			Type:     neocode.F(neocode.FilePartInputTypeFile),
			Mime:     neocode.F(att.MediaType),
			URL:      neocode.F(att.URL),
			Filename: neocode.F(att.Filename),
		}
		switch att.Type {
		case "file":
			if fs, ok := att.GetFileSource(); ok {
				filePart.Source = neocode.F(
					neocode.FilePartSourceUnionParam(neocode.FileSourceParam{
						Type: neocode.F(neocode.FileSourceTypeFile),
						Path: neocode.F(fs.Path),
						Text: neocode.F(neocode.FilePartSourceTextParam{
							Start: neocode.F(int64(att.StartIndex)),
							End:   neocode.F(int64(att.EndIndex)),
							Value: neocode.F(att.Display),
						}),
					}),
				)
			}
		case "symbol":
			if ss, ok := att.GetSymbolSource(); ok {
				filePart.Source = neocode.F(
					neocode.FilePartSourceUnionParam(neocode.SymbolSourceParam{
						Type: neocode.F(neocode.SymbolSourceTypeSymbol),
						Path: neocode.F(ss.Path),
						Name: neocode.F(ss.Name),
						Kind: neocode.F(int64(ss.Kind)),
						Range: neocode.F(neocode.SymbolSourceRangeParam{
							Start: neocode.F(neocode.SymbolSourceRangeStartParam{
								Line:      neocode.F(float64(ss.Range.Start.Line)),
								Character: neocode.F(float64(ss.Range.Start.Char)),
							}),
							End: neocode.F(neocode.SymbolSourceRangeEndParam{
								Line:      neocode.F(float64(ss.Range.End.Line)),
								Character: neocode.F(float64(ss.Range.End.Char)),
							}),
						}),
						Text: neocode.F(neocode.FilePartSourceTextParam{
							Start: neocode.F(int64(att.StartIndex)),
							End:   neocode.F(int64(att.EndIndex)),
							Value: neocode.F(att.Display),
						}),
					}),
				)
			}
		}
		parts = append(parts, filePart)
	}
	return parts
}
